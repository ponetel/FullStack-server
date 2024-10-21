import connected from "../config/db_mysql.js";
import { v4 as uuidv4 } from "uuid";
import { EMessage, Role, SMessage } from "../service/message.js";
import crypto from "crypto-js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { Decryt, Encrypt, GenerateToken } from "../service/service.js";
export default class UserController {
  static async Login(req, res) {
    try {
      const { email, password } = req.body;
      const validate = await ValidateData({ email, password });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const checkEmail = "select * from user where email= ?";
      connected.query(checkEmail, email, async (err, result) => {
        if (err) return SendError(res, 404, EMessage.NotFound, err);
        if (!result[0]) return SendError(res, 404, EMessage.NotFound);
        const decrytPassword = await Decryt(result[0]["password"]);
        console.log(decrytPassword);
        if (decrytPassword !== password) {
          return SendError(res, 400, EMessage.IsMatch);
        }
        const token = await GenerateToken(result[0]["userID"]);
        if(!token) return SendError(res,400,EMessage.EToken);
        return SendSuccess(res, EMessage.Login, token);
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Eserver, error);
    }
  }
  static async Register(req, res) {
    try {
      // request body
      const { userName, email, phoneNumber, password } = req.body;
      // validate data
      const validate = await ValidateData({
        userName,
        email,
        phoneNumber,
        password,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const userID = uuidv4();
      const datetime = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      //check email already
      const select = "select * from user where email=?";
      connected.query(select, email, async (error, isMatch) => {
        if (error) throw error;
        if (isMatch[0]) return SendError(res, 208, SMessage.EmailAlready);

        // insert mysql
        const insert = `Insert into user(userID,userName,email,phoneNumber,password,role,createdAt,updatedAt)
       values (?,?,?,?,?,?,?,?)`;
        const genPassword = await Encrypt(password);
        const data = [
          userID,
          userName,
          email,
          phoneNumber,
          genPassword,
          Role.user,
          datetime,
          datetime,
        ];
        connected.query(insert, data, (err) => {
          if (err) return SendError(res, 404, EMessage.ERegister, err);

          return SendCreate(res, SMessage.Login);
        });
      });
    } catch (error) {
      return SendError(res, 500, EMessage.Eserver, error);
    }
  }
}

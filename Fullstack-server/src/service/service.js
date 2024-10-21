import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import { SECRET_KEY,SECRET_KEY_REFRESH} from "../config/globalKey.js";
export const Decryt = async (data)=>{
    return CryptoJS.AES.decrypt(data,SECRET_KEY).toString(CryptoJS.enc.Utf8)
    
};

export const Encrypt = async(data)=>{
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const GenerateToken = (data)=>{
    return new Promise (async (resolve, reject)=>{
        try{
            const payload = {
                id: data,
            }
            const token = jwt.sign(payload,SECRET_KEY,{expiresIn: "2h"})
            const refreshToken = jwt.sign(payload,SECRET_KEY_REFRESH,{expiresIn: "4h"})
            if(!token || !refreshToken){
                reject("Error Generate Token")
            }
            console.log({token,refreshToken})
            resolve({token,refreshToken})

        }catch (error){
            reject(error)

        }
    })
}
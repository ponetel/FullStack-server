import express from "express";
import UserController from "../controller/user.controller.js";
const router = express.Router();

const user ="/user";
router.post(`${user}/login`,UserController.Login);
router.post(`${user}/register`,UserController.Register);
export default router;

import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../validators/auth.validator";

const authRouter = express.Router();

/** 로그인 엔드포인트 */
authRouter.post("/login", AuthController.login);

/** 회원가입 엔드포인트 */
authRouter.post("/register", AuthValidator.register, AuthController.register);

export default authRouter;

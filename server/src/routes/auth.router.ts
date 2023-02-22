import express from "express";
import AuthController from "../controllers/auth.controller";
import { isAuth } from "../middlewares/isAuth";
import AuthValidator from "../validators/auth.validator";

const authRouter = express.Router();

/** 로그인 엔드포인트 */
authRouter.post("/login", AuthController.login);

/** 테스트용 어드민 회원가입 엔드포인트 */
authRouter.post("/admin-register", AuthValidator.register, AuthController.adminRegister);

/** 일반 회원가입 엔드포인트 */
authRouter.post("/register", AuthValidator.register, AuthController.register);

/** 이메일 인증 엔드포인트 */
authRouter.get("/verify/:verifyToken", AuthController.verify);

/** 리프레쉬 토큰으로 엑세스 토큰 재발급 엔드포인트 */
authRouter.post("/token", AuthController.token);

/** 로그아웃 엔드포인트 */
authRouter.get("/logout/:userId", isAuth, AuthController.logout);

export default authRouter;

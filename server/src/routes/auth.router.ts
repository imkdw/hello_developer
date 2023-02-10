import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../validators/auth.validator";

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthValidator.register, AuthController.register);

export default authRouter;

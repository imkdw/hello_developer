import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";

class AuthController {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: LoginUserDTO = req.body;

    try {
      const token = await AuthService.login(userDTO);
      res.status(200).json("good");
    } catch (err: any) {
      throw err;
    }
  };

  /** 회원가입 컨트롤러 */
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;

    try {
      await AuthService.register(userDTO);
      res.status(201).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default AuthController;

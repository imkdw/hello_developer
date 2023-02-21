import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";

class AuthController {
  /** 로그인 컨트롤러 */
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: LoginUserDTO = req.body;

    try {
      const { accessToken, refreshToken, userId } = await AuthService.login(userDTO);
      res.status(200).json({ accessToken, refreshToken, userId });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static register = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;

    try {
      const userId = await AuthService.register(userDTO);
      res.status(201).json({ userId });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static adminRegister = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;

    try {
      const userId = await AuthService.adminRegister(userDTO);
      res.status(201).json({ userId });
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static verify = async (req: Request, res: Response) => {
    const { verifyToken } = req.params;

    try {
      await AuthService.verify(verifyToken);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };

  static token = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.body;

    try {
      const token = await AuthService.token(accessToken, refreshToken);
      res.status(200).json(token);
    } catch (err: any) {
      res.status(err.status || 500).json({ code: err.code, message: err.message });
    }
  };
}

export default AuthController;

import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";

class AuthController {
  /**
   * 로그인 컨트롤러
   * @returns - 엑세스토큰, 리프레쉬토큰, 사용자 아이디, 프로필사진, 닉네임 반환
   */
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: LoginUserDTO = req.body;

    try {
      const loginRecords = await AuthService.login(userDTO);
      res.status(200).json({ ...loginRecords });
    } catch (err: any) {
      next(err);
    }
  };

  /**
   * 회원가입 컨트롤러
   * @returns - 유저의 아이디 반환(테스트용)
   */
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;

    try {
      const userId = await AuthService.register(userDTO);
      res.status(201).json({ userId });
    } catch (err: any) {
      next(err);
    }
  };

  /**
   * 테스트를 위한 어드민 회원가입 컨트롤러
   * @returns - 유저의 아이디 반환(테스트용)
   */
  static adminRegister = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;

    try {
      const userId = await AuthService.adminRegister(userDTO);
      res.status(201).json({ userId });
    } catch (err: any) {
      next(err);
    }
  };

  /**
   * 이메일인증 컨트롤러
   */
  static verify = async (req: Request, res: Response, next: NextFunction) => {
    const { verifyToken } = req.params;

    try {
      await AuthService.verify(verifyToken);
      res.status(200).json();
    } catch (err: any) {
      next(err);
    }
  };

  /**
   * 로그아웃 컨트롤러
   */
  static logout = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const accessToken = req.headers.authorization?.split(" ")[1] as string;

    try {
      AuthService.logout(userId, accessToken);
      res.status(200).json();
    } catch (err: any) {
      res.status(err.status || 500).json({ message: err.message });
    }
  };

  static token = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.body;

    try {
      const token = await AuthService.token(accessToken, refreshToken);
      res.status(200).json(token);
    } catch (err: any) {
      next(err);
    }
  };
}

export default AuthController;

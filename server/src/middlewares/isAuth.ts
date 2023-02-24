import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  /** 헤더에 토큰이 존재하지 않을 경우 */
  if (!authorization) {
    res.status(400).json({ code: "auth-007", message: "invalid_token" });
    return;
  }

  try {
    const accessToken = authorization?.split(" ")[1];
    const decodedToken = Jwt.verify(accessToken);
    res.locals.userId = decodedToken?.userId;
    next();
  } catch (err: any) {
    console.error(err);
    res.status(err.status || 500).json({ code: err.code, message: err.message });
  }
};

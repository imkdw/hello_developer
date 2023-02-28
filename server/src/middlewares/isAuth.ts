import { Request, Response, NextFunction } from "express";
import Jwt from "../utils/jwt";

export const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  /** 헤더에 토큰이 존재하지 않을 경우 */
  if (!authorization || authorization.length === 1) {
    console.log(req.headers);

    const err = Object.assign(new Error(), {
      status: 404,
      message: "Not Found",
      description: "Token not found",
      data: {
        action: "auth",
        parameter: "",
        message: "token_not_found",
      },
    });
    next(err);
    return;
  }

  try {
    const accessToken = authorization.split(" ")[1];
    const decodedToken = Jwt.verify(accessToken);

    if (!decodedToken) {
      const err = Object.assign(new Error(), {
        status: 400,
        message: "Bad Request",
        description: "Email format is invalid",
        data: {
          action: "register",
          parameter: "",
          message: "invalid_email",
        },
      });
      next(err);
      return;
    }

    res.locals.userId = decodedToken.userId;
    next();
  } catch (err: any) {
    next(err);
  }
};

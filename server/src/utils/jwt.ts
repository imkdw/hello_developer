import * as jwt from "jsonwebtoken";
import config from "../config";
import { JwtVerifyReturn } from "../types/jwt";

class Jwt {
  static sign = (kindOfToken: string, userId: string, email: string, nickname: string) => {
    const [atkExpiresIn, rtkExpiresIn] = [config.jwt.atkExpiresIn, config.jwt.rtkExpiresIn];
    return jwt.sign({ userId, email, nickname }, config.jwt.secretKey, {
      expiresIn: kindOfToken === "access" ? atkExpiresIn : rtkExpiresIn,
    });
  };

  static verify = (accessToken: string) => {
    try {
      return jwt.verify(accessToken, config.jwt.secretKey) as JwtVerifyReturn;
    } catch (err: any) {
      if (err instanceof jwt.TokenExpiredError) {
        throw {
          status: 401,
          code: "auth-008",
          message: "expired_token",
        };
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw {
          status: 401,
          code: "auth-007",
          message: "invalid_token",
        };
      }
    }
  };

  static decode = (token: string) => {
    try {
      const decodedToken = jwt.decode(token);
      return decodedToken;
    } catch (err: any) {
      throw err;
    }
  };
}

export default Jwt;

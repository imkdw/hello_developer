import * as jwt from "jsonwebtoken";
import config from "../config";
import { JwtVerifyReturn } from "../types/jwt";

class Jwt {
  static sign = (kindOfToken: string, userId: string) => {
    const [atkExpiresIn, rtkExpiresIn] = [config.jwt.atkExpiresIn, config.jwt.rtkExpiresIn];
    return jwt.sign({ userId }, config.jwt.secretKey, {
      expiresIn: kindOfToken === "access" ? atkExpiresIn : rtkExpiresIn,
    });
  };

  static verify = (accessToken: string) => {
    try {
      return jwt.verify(accessToken, config.jwt.secretKey) as JwtVerifyReturn;
    } catch (err: any) {
      /** 토큰이 만료됬을경우 */
      if (err instanceof jwt.TokenExpiredError) {
        throw Object.assign(new Error(), {
          status: 400,
          message: "Bad Request",
          description: "Your token is expired",
          data: {
            action: "jwt",
            parameter: "",
            message: "expired_token",
          },
        });
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw Object.assign(new Error(), {
          status: 400,
          message: "Bad Request",
          description: "Your token is invalid",
          data: {
            action: "jwt",
            parameter: "",
            message: "invalid_token",
          },
        });
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

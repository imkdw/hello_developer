import * as jwt from "jsonwebtoken";
import config from "../config";

class Jwt {
  static sign = (userId: string, email: string, nickname: string) => {
    return jwt.sign({ userId, email, nickname }, config.jwt.secretKey, {
      expiresIn: config.jwt.atkExpiresIn,
    });
  };
}

export default Jwt;

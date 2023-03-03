import { Jwt, JwtPayload } from "jsonwebtoken";

export interface JwtVerifyReturn extends Jwt {
  userId: string;
  email: string;
  nickname: string;
}

import { RowDataPacket } from "mysql2";

export interface RegisterUserDTO {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface findUserByEmailReturn extends RowDataPacket {
  user_id: string;
  email: string;
  password: string;
  nickname: string;
  profile_img: string;
}

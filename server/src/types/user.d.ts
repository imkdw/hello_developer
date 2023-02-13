import { RowDataPacket } from "mysql2";

/** Model : 사용자 아이디로 유저 정보 가져오는 쿼리 반환값 */
export interface FindUserByUserIdReturn extends RowDataPacket {
  user_id: string;
  email: string;
  password: string;
  introduce: string;
  profile_img: string;
  created_at_date: string;
  nickname: string;
  is_auth_flag: number;
  updated_at_date: string;
}

import { RowDataPacket } from "mysql2";

export interface AllComments {
  postId: string;
  createdAt: string;
}

export interface UpdateProfileUserDTO {
  nickname: string;
  introduce: string;
  password: string;
  rePassword: string;
}

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

/** Model : 사용자 아이디로 북마크한 게시글 아이디 가져오는 쿼리 반환값 */
export interface FindBookmarkPostByUserIdReturn extends RowDataPacket {
  post_id: string;
}

import { RowDataPacket } from "mysql2";

export interface AddPostUserDTO {
  title: string;
  content: string;
  category: string;
  tags: {
    name: string;
  }[];
}

/** Model : 카테고리 이름으로 아이디 가져오는 함수 반환값 */
export interface FindCategoryIdByNameReturn extends RowDataPacket {
  category_id: number;
}

/** Model : 태그 이름으로 아이디 가져오는 쿼리 반환값 */
export interface FindTagIdByNameReturn extends RowDataPacket {
  tag_id: number;
}

/** Model : 카테고리 아이디로 게시글 가져오는 쿼리 반환값 */
export interface FindPostByCategoryIdReturn extends RowDataPacket {
  post_id: string;
  title: string;
  created_at_date: string;
  content: string;
  user_id: string;
}

/** Model : 게시글 아이디로 태그 아이디 가져오는 쿼리 반환값 */
export interface findTagIdByPostIdReturn extends RowDataPacket {
  tag_id: number;
}

/** Model : 태그 아이디로 태그 이름 가져오는 쿼리 반환값 */
export interface FindTagNameByIdReturn extends RowDataPacket {
  name: string;
}

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

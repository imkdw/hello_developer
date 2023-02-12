import { FieldPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db/db";
import { AddPostUserDTO, FindCategoryIdByNameReturn, FindTagIdByNameReturn } from "../types/post";

export class PostModel {
  static add = async (userId: string, postId: string, category: number[], userDTO: AddPostUserDTO) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      /** 1. 제목, 내용, 카테고리 추가 */
      const postQuery =
        "INSERT INTO post(post_id, user_id, title, content, category_id1, category_id2) VALUES(?, ?, ?, ?, ?, ?)";
      const postValues = [
        postId,
        userId,
        userDTO.title,
        userDTO.content,
        category[0],
        category.length === 2 ? category[1] : null,
      ];
      await connection.execute(postQuery, postValues);

      /** 2. 태그 추가 */
      for (const tag of userDTO.tags) {
        const tagName = tag.name.toLowerCase();

        const [tagResult, tagFields]: [FindTagIdByNameReturn[], FieldPacket[]] = await connection.query(
          "SELECT tag_id FROM tags WHERE name=?",
          [tagName]
        );

        let tagId;

        if (tagResult.length === 0) {
          /** 기존에 등록된 태그 없을경우 새로 등록하고 auto_increment로 증가한 아이디를 가져옴 */
          const [tagResult, tagFields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
            "INSERT INTO tags(name) VALUES(?)",
            [tagName]
          );
          tagId = tagResult.insertId;
        } else {
          /** 기존에 태그가 존재하면 가져온 tagId를 대입 */
          tagId = tagResult[0].tag_id;
        }

        const postTagsQuery = "INSERT INTO post_tags(post_id, tag_id) VALUES(?, ?)";
        await connection.execute(postTagsQuery, [postId, tagId]);
      }

      /** 3. 조회수 테이블 데이터 추가 */
      const viewQuery = "INSERT INTO post_views(post_id) VALUES(?)";
      await connection.execute(viewQuery, [postId]);

      await connection.commit();
    } catch (err: any) {
      await connection.rollback();
      throw {
        status: 500,
        message: err.message,
      };
    } finally {
      connection.release();
    }
  };

  static findCategoryIdByName = async (name: string) => {
    const query = "SELECT category_id FROM post_category WHERE name = ?";

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindCategoryIdByNameReturn[], FieldPacket[]] = await connection.execute(query, [
        name,
      ]);
      connection.destroy();
      return rows[0];
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };
}

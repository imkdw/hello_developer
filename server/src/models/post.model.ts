import { FieldPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db/db";
import {
  AddPostUserDTO,
  FindCategoryIdByNameReturn,
  FindPostByCategoryIdReturn,
  FindTagIdByNameReturn,
  findTagIdByPostIdReturn,
  FindTagNameByIdReturn,
} from "../types/post";

export class PostModel {
  /**
   * 새로운 게시글 생성
   * @param {string} userId - 유저의 ID(uuid)
   * @param {string} postId - 게시물 ID(uuid)
   * @param {number[]} category - 게시물 카테고리 ID들
   * @param {AddPostUserDTO} userDTO - 사용자가 입력한 값들
   * @returns {null} - 반환값 없음
   */
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

  /**
   * 카테고리 아이디 검색 (카테고리 이름으로)
   * @param {string} name - 카테고리 이름(notice, suggestion 등)
   * @returns {FindCategoryIdByNameReturn[]} - 카테고리 id를 반환
   */
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

  /**
   * 게시글 목록 검색 (카테고리 아이디로)
   * @param {number} categoryId1 - 메인 카테고리 아이디
   * @param {number | undefined} categoryId1 - 서브 카테고리 아이디
   * @returns {FindPostByCategoryIdReturn[]} - 게시글 목록을 반환
   */
  static findPostByCategoryId = async (categoryId1: number, categoryId2?: number) => {
    const query = `SELECT post_id, title, created_at_date, content, user_id FROM post WHERE category_id1 = ? ${
      categoryId2 ? "AND category_id2 = ?" : ""
    }`;
    const values = categoryId2 ? [categoryId1, categoryId2] : [categoryId1];

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindPostByCategoryIdReturn[], FieldPacket[]] = await connection.execute(
        query,
        values
      );
      connection.release();
      return rows;
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  /**
   * 게시글 태그 아이디 검색 (게시글 아이디로)
   * @param {string} postId - 게시물 ID
   */
  static findTagIdByPostId = async (postId: string) => {
    const query = "SELECT tag_id FROM post_tags WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [findTagIdByPostIdReturn[], FieldPacket[]] = await connection.execute(query, [
        postId,
      ]);
      connection.release();
      return rows;
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  /**
   * 게시글 태그 이름 검색 (태그 아이디로)
   * @param {number} tagId - 태그 아이디
   * @returns {}
   */
  static findTagNameById = async (tagId: number) => {
    const query = "SELECT name FROM tags WHERE tag_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindTagNameByIdReturn[], FieldPacket[]] = await connection.execute(query, [
        tagId,
      ]);
      connection.release();
      return rows[0];
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };
}

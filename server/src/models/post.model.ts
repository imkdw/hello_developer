import { FieldPacket, ResultSetHeader } from "mysql2";
import { pool } from "../db/db";
import {
  AddPostUserDTO,
  FindCategoryIdByNameReturn,
  FindCategoryNameByIdReturn,
  FindCommentByIdReturn,
  FindCommentByPostId,
  FindCommentByUserIdReturn,
  FindPostByCategoryIdReturn,
  FindPostByPostIdReturn,
  FindPostByUserIdReturn,
  FindRecommedationByUserAndPostIdReturn,
  FindReCommentByCommentIdReturn,
  FindReCommentByUserIdReturn,
  FindTagIdByNameReturn,
  findTagIdByPostIdReturn,
  FindTagNameByIdReturn,
  FindViewCntByPostIdReturn,
  UpdatePostUserDTO,
} from "../types/post";
import { Time } from "../utils/time";

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
        category[1] ? category[1] : null,
      ];
      await connection.execute(postQuery, postValues);

      /** 2. 태그 추가 */
      for (const tag of userDTO.tags) {
        if (tag.name.length === 0) {
          continue;
        }

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
   * 게시물에 댓글 작성
   * @param {string} userId - 사용자 아이디
   * @param {string} postId - 게시글 아이디
   * @param {string} comment - 댓글 내용
   */
  static addComment = async (userId: string, postId: string, comment: string) => {
    const query = "INSERT INTO comment(post_id, user_id, content) VALUES(?, ?, ?)";
    const values = [postId, userId, comment];

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(query, values);
      connection.release();
      return rows.insertId;
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  /**
   * 댓글의 대댓글 작성
   * @param {string} userId - 사용자 아이디
   * @param {string} commentId - 댓글 아이디
   * @param {string} reComment - 대댓글 내용
   */
  static addReComment = async (userId: string, commentId: string, reComment: string) => {
    const query = "INSERT INTO re_comment(user_id, comment_id, content) VALUES(?, ?, ?)";
    const values = [userId, commentId, reComment];

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(query, values);
      connection.release();
      return rows.insertId;
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

  /**
   * 댓글 정보 가져오기(게시글 아이디로)
   * @param {string} postId - 게시글 아이디
   * @return {} - 댓글 정보
   */
  static findCommentByPostId = async (postId: string) => {
    const query = "SELECT * FROM comment WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindCommentByPostId[], FieldPacket[]] = await connection.execute(query, [
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
   * 대댓글 정보 가져오기(댓글 아이디로)
   * @param {number} commentId - 게시글 아이디
   * @return {FindReCommentByCommentIdReturn} - 댓글 정보
   */
  static findReCommentByCommentId = async (commentId: number) => {
    const query = "SELECT * FROM re_comment WHERE comment_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindReCommentByCommentIdReturn[], FieldPacket[]] = await connection.execute(
        query,
        [commentId]
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
    const query = `SELECT post_id, title, created_at_date, content, user_id, category_id2 FROM post WHERE category_id1 = ? ${
      categoryId2 ? "AND category_id2 = ?" : ""
    } ORDER BY created_at_date DESC `;
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
   * 게시글 검색 (게시글 아이디로)
   */
  static findPostByPostId = async (postId: string) => {
    const query = "SELECT * FROM post WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindPostByPostIdReturn[], FieldPacket[]] = await connection.execute(query, [
        postId,
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

  static findPostByUserId = async (userId: string) => {
    const query = "SELECT * FROM post WHERE user_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindPostByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [
        userId,
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

  static findCommentByUserId = async (userId: string) => {
    const query = "SELECT comment_id, post_id, created_at_date FROM comment WHERE user_id = ?";

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindCommentByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [
        userId,
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

  static findRecommentByUserId = async (userId: string) => {
    const query = "SELECT comment_id, created_at_date FROM re_comment WHERE user_id = ?";

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindReCommentByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [
        userId,
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

  static findCommentById = async (commentId: number) => {
    const query = "SELECT post_id FROM comment WHERE comment_id = ?";

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindCommentByIdReturn[], FieldPacket[]] = await connection.execute(query, [
        commentId,
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

  static deletePost = async (userId: string, postId: string) => {
    const query = "DELETE FROM post WHERE post_id = ? AND user_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.query(query, [userId, postId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static deleteComment = async (userId: string, commentId: number) => {
    const query = "DELETE FROM comment WHERE user_id = ? AND comment_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.query(query, [userId, commentId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static deleteReComment = async (userId: string, reCommentId: number) => {
    const query = "DELETE FROM re_comment WHERE user_id = ? AND re_comment_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.query(query, [userId, reCommentId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static recommendation = async (userId: string, postId: string, type: "add" | "delete") => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      /** POST 테이블 추천수 업데이트 */
      let postQuery = `UPDATE post SET recommend_cnt = recommend_cnt ${
        type === "add" ? "+" : "-"
      } 1 WHERE post_id = ?`;
      await connection.execute(postQuery, [postId]);

      /** recommedation 테이블 row 추가,삭제 */
      let recommedationQuery =
        type === "add"
          ? "INSERT INTO post_recommendation(user_id, post_id) VALUES(?, ?)"
          : "DELETE FROM post_recommendation WHERE user_id = ? AND post_id = ?";
      await connection.execute(recommedationQuery, [userId, postId]);

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

  static findRecommedationByUserAndPostId = async (userId: string, postId: string) => {
    const query = "SELECT recommendation_id FROM post_recommendation WHERE user_id = ? AND post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindRecommedationByUserAndPostIdReturn[], FieldPacket[]] =
        await connection.query(query, [userId, postId]);
      connection.release();
      return rows[0];
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static views = async (postId: string) => {
    const query = "UPDATE post_views SET view_cnt = view_cnt + 1 WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [postId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static findViewCntByPostId = async (postId: string) => {
    const query = "SELECT view_cnt FROM post_views WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindViewCntByPostIdReturn[], FieldPacket[]] = await connection.execute(query, [
        postId,
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

  static updateComment = async (commentId: string, commentText: string) => {
    const query = "UPDATE comment SET content = ?, updated_at_date = ? WHERE comment_id = ?";
    const values = [commentText, Time.now(), commentId];
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, values);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static updateReComment = async (reCommentId: string, reCommentText: string) => {
    const query = "UPDATE re_comment SET content = ?, updated_at_date = ? WHERE re_comment_id = ?";
    const values = [reCommentText, Time.now(), reCommentId];
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, values);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static findTagIdByName = async (tagName: string) => {
    const query = "SELECT tag_id FROM tags WHERE name = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindTagIdByNameReturn[], FieldPacket[]] = await connection.execute(query, [
        tagName,
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

  static findTagsByPostId = async (postId: string) => {
    const query = "SELECT * FROM post_tags WHERE post_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [[], FieldPacket[]] = await connection.execute(query, [postId]);
      connection.release();
      return rows;
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static updatePost = async (
    userId: string,
    postId: string,
    userDTO: UpdatePostUserDTO,
    categoryIds: (number | null)[]
  ) => {
    const { title, content } = userDTO;

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 태그를 제외한 컬럼 먼저 업데이트
      await connection.execute(
        "UPDATE post SET title=?, content=?, category_id1=?, category_id2=? WHERE post_id = ? AND user_id = ?",
        [title, content, categoryIds[0], categoryIds[1], postId, userId]
      );

      /**
       * 1. 태그 아이디로 태그 네임을 검색
       * 2. 태그 네임이 없을경우 tags 테이블에 추가
       * 3. 기존 tagIds의 값과 새로 추가된 값을 post_tags 테이블에 추가
       */
      const tagIds = await Promise.all(
        userDTO.tags.map(async (tag) => {
          const tagId = await this.findTagIdByName(tag.name);

          // 태그 아이디가 없다면 새로운 태그 추가, id 반환
          if (!tagId) {
            const [rows, fields]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
              "INSERT INTO tags(name) VALUES(?)",
              [tag.name]
            );

            return rows.insertId;
          }

          return tagId.tag_id;
        })
      );

      // 기존 tag를 모두 삭제
      await connection.execute("DELETE FROM post_tags WHERE post_id = ?", [postId]);

      // 새로운 tag를 추가
      await Promise.all(
        tagIds.map(async (tagId) => {
          await connection.execute("INSERT INTO post_tags(post_id, tag_id) VALUES(?,?)", [postId, tagId]);
        })
      );

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

  static findCategoryNameById = async (categoryId: number) => {
    const query = "SELECT name FROM post_category WHERE category_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindCategoryNameByIdReturn[], FieldPacket[]] = await connection.execute(query, [
        categoryId,
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

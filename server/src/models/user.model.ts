import { FieldPacket } from "mysql2";
import { pool } from "../db/db";
import { FindUserByUserIdReturn, FindBookmarkPostByUserIdReturn } from "../types/user";

export class UserModel {
  /**
   * 유저 검색 (유저 아이디로)
   * @param {string} userId - 유저의 아이디
   * @returns {FindUserByUserIdReturn} - 유저 정보 반환
   */
  static findUserByUserId = async (userId: string) => {
    const query = "SELECT * FROM user WHERE user_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindUserByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [userId]);
      connection.release();
      return rows[0];
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static addBookmark = async (postId: string, userId: string) => {
    const query = "INSERT INTO bookmark(post_id, user_id) VALUES(?, ?)";
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [postId, userId]);
      connection.release();
    } catch (err: any) {
      throw err;
    }
  };

  static deleteBookmark = async (postId: string, userId: string) => {
    const query = "DELETE FROM bookmark WHERE post_id = ? AND user_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [postId, userId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static history = async (item: string) => {
    try {
      const connection = await pool.getConnection();
      connection.release();
    } catch (err: any) {
      throw err;
    }
  };

  static findBookmarkPostByUserId = async (userId: string) => {
    const query = "SELECT post_id FROM bookmark WHERE user_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindBookmarkPostByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [
        userId,
      ]);
      connection.release();
      return rows;
    } catch (err: any) {
      throw err;
    }
  };

  static updateUser = async (userId: string, updateFieldQuery: string) => {
    const query = `UPDATE user SET ${updateFieldQuery} WHERE user_id = ?`;
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [userId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static exit = async (userId: string) => {
    const query = "DELETE FROM user WHERE user_id = ?";
    try {
      const connection = await pool.getConnection();
      await connection.execute(query, [userId]);
      connection.release();
    } catch (err: any) {
      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static image = async (userId: string, imageUrl: string) => {
    try {
      const query = "UPDATE user SET profile_img = ? WHERE user_id = ?";
      const connection = await pool.getConnection();
      await connection.execute(query, [imageUrl, userId]);
      connection.release();
    } catch (err: any) {
      throw err;
    }
  };
}

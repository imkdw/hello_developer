import { FieldPacket } from "mysql2";
import { pool } from "../db/db";
import { FindUserByUserIdReturn } from "../types/user";

export class UserModel {
  /**
   * 유저 검색 (유저 아이디로)
   * @param {string} userId - 유저의 아이디
   * @returns {FindUserByUserIdReturn} - 유저 정보 반환
   */
  static findUserByUserId = async (userId: string) => {
    const query = "SELECT nickname, profile_img FROM user WHERE user_id = ?";
    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [FindUserByUserIdReturn[], FieldPacket[]] = await connection.execute(query, [
        userId,
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

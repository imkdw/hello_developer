import { RegisterUserDTO, findUserByEmailReturn } from "../types/auth";
import { pool } from "../db/db";
import { FieldPacket } from "mysql2";

class AuthModel {
  /**
   * 이메일로 유저의 정보 확인
   * @param {string} email - 유저 이메일
   * @returns {findUserByEmailReturn[]} - user_id, email, password, nickname
   */
  static findUserByEmail = async (email: string): Promise<findUserByEmailReturn[] | never[]> => {
    const query = "SELECT user_id, email, password, nickname FROM user WHERE email = ?";

    try {
      const connection = await pool.getConnection();
      const [rows, fields]: [findUserByEmailReturn[], FieldPacket[]] = await connection.execute(query, [
        email,
      ]);
      connection.release();
      return rows;
    } catch (err: any) {
      throw err;
    }
  };

  static register = async (userId: string, userDTO: RegisterUserDTO) => {
    const query = "INSERT INTO user(user_id, email, password, nickname) VALUES(?, ?, ?, ?)";
    const values = [userId, userDTO.email, userDTO.password, userDTO.nickname];

    try {
      const connection = await pool.getConnection();
      await connection.execute(query, values);
      connection.release();
    } catch (err: any) {
      throw err;
    }
  };
}

export default AuthModel;

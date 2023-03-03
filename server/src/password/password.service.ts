import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  /**
   * 비밀번호 암호화
   * @param password - 평문 비밀번호
   * @returns {string} - 암호화된 비밀번호
   */
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * 평문 비밀번호화 암호화된 비밀번호가 일치하는지 확인
   * @param password - 평문 비밀번호
   * @param hashedPassword - 암호화된 비밀번호
   * @returns {boolean} - 비밀번호의 일치여부
   */
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

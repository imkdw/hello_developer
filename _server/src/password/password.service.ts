import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  /**
   * 비밀번호 암호화 서비스
   * @param password - 평문 비밀번호
   * @returns 암호화된 비밀번호 반환
   */
  async encrypt(password: string): Promise<string> {
    // TODO: Salt 생성 Round 환경변수로 변경
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**
   * 평문 비밀번호와 암호화된 비밀번호 비교 서비스
   * @param password - 평문 비밀번호
   * @param hashedPassword - 암호화된 비밀번호
   * @returns 일치여부반환
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    const isMatchPassword = await bcrypt.compare(password, hashedPassword);
    return isMatchPassword;
  }
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class UtilsService {
  /**
   * 평문 단방향 암호화 서비스
   * @param plainText - 평문 텍스트
   * @returns 암호화된 텍스트 반환
   */
  async encrypt(plainText: string): Promise<string> {
    // TODO: Salt 생성 Round 환경변수로 변경
    const salt = await bcrypt.genSalt(10);
    const hashedText = await bcrypt.hash(plainText, salt);
    return hashedText;
  }

  /**
   * 평문 텍스트 암호화된 텍스트 일치여부 비교 서비스
   * @param plainText - 평문 비밀번호
   * @param hashedText - 암호화된 비밀번호
   * @returns 일치여부 반환
   */
  async compare(plainText: string, hashedText: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hashedText);
    return isMatch;
  }

  /**
   * UUID 생성 서비스
   * @returns UUID 텍스트
   */
  getUUID(): string {
    return v4();
  }
}

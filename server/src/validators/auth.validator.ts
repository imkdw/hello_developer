import { Request, Response, NextFunction } from "express";
import { RegisterUserDTO } from "../types/auth";

/**
 * 클라이언트로 에러를 반환하는 함수
 * @param {Response } res - express res 객체
 * @param {string} code - 에러 코드
 * @param {string} message - 에러 메세지
 */
const errorHandler = (res: Response, code: string, message: string) => {
  res.status(400).json({ code, message });
};

class AuthValidator {
  /**
   * 회원가입시 userDTO의 형식이 올바른지 검사하는 미들웨어
   */
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const userDTO: RegisterUserDTO = req.body;
    const { email, password, nickname } = userDTO;

    try {
      /**
       * 이메일 유효성 검증
       * 1. 이메일이 비어있는지 확인
       * 2. 이메일 형식이 올바른지 확인(정규식 / RFC 5322)
       */
      const emailRegExp =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
      if (email.length === 0 || !email.match(emailRegExp)) {
        errorHandler(res, "auth-001", "invalid_email");
        return;
      }

      /**
       * 비밀번호 유효성 검증
       * 1. 비밀번호가 10자리 이상인지 확인
       * 2. 비밀번호가 특수문자를 포함하는지 확인
       */
      const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
      if (password.length < 10 || !password.match(specialCharRegExp)) {
        errorHandler(res, "auth-002", "invalid_password");
        return;
      }

      /** 닉네임 유효성 검증
       * 1. 닉네임이 2자리 이상, 8자리 이하인지 확인
       * 2. 닉네임에 특수문자가 미포함 되어있는지 확인
       */
      if (!(nickname.length >= 2 && nickname.length <= 8) || nickname.match(specialCharRegExp)) {
        errorHandler(res, "auth-003", "invalid_nickname");
        return;
      }

      next();
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  };
}

export default AuthValidator;

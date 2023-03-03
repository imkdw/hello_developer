import { NextFunction, Request, Response } from "express";
import { UpdateProfileUserDTO } from "../types/user";

export class UserValidator {
  static profile = (req: Request, res: Response, next: NextFunction) => {
    const userDTO: UpdateProfileUserDTO = req.body;
    const { nickname, introduce, password, rePassword } = userDTO;

    /**
     * 닉네임 유효성 검증
     * 1. 비밀번호가 10자리 이상인지 확인
     * 2. 비밀번호가 특수문자를 포함하는지 확인
     */
    const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    if (nickname.length === 0 || !(nickname.length >= 2 && nickname.length <= 8) || nickname.match(specialCharRegExp)) {
      const err = Object.assign(new Error(), {
        status: 400,
        message: "Bad Request",
        description: "Nickname format is invalid",
        data: {
          action: "user",
          parameter: nickname,
          message: "invalid_nickname",
        },
      });
      next(err);
    }

    /**
     * 자기소개 유효성 검증
     * 1. 자기소개는 0~30자 사이로 입력 가능
     */
    if (introduce.length > 31) {
      const err = Object.assign(new Error(), {
        status: 400,
        message: "Bad Request",
        description: "You can enter 0 to 30 digits of the introduction phrase.",
        data: {
          action: "user",
          parameter: introduce,
          message: "invalid_introduce",
        },
      });
      next(err);
    }

    /**
     * 재설정 할 비밀번호 유효성 검증
     * 1. 재설정 할 비밀번호가 10자리 이상인지 확인
     * 2. 재설정 할 비밀번호가 특수문자를 포함하는지 확인
     */
    if (password && rePassword && (rePassword.length < 10 || !rePassword.match(specialCharRegExp))) {
      const err = Object.assign(new Error(), {
        status: 400,
        message: "Bad Request",
        description: "Password format is invalid",
        data: {
          action: "user",
          parameter: "password",
          message: "invalid_password",
        },
      });
      next(err);
    }

    next();
  };
}

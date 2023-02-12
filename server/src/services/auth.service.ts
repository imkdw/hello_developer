import AuthModel from "../models/auth.model";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";
import Jwt from "../utils/jwt";
import Secure from "../utils/secure";

class AuthService {
  static login = async (userDTO: LoginUserDTO) => {
    try {
      /** 이메일로 유저정보 확인 */
      const user = await AuthModel.findUserByEmail(userDTO.email);

      /** 유저가 없는경우 */
      if (user.length === 0) {
        throw {
          status: 400,
          code: "auth-006",
          message: "invalid_email_or_password",
        };
      }

      /** 비밀번호가 일치하지 않은경우 */
      const isSamePassword = await Secure.compareHash(userDTO.password, user[0].password);
      if (!isSamePassword) {
        throw {
          status: 400,
          code: "auth-006",
          message: "invalid_email_or_password",
        };
      }

      /**
       * @todo Need to make refresh token login
       * @body Make https enviroment too
       */
      /** accessToken 발행 */
      const { user_id, email, nickname } = user[0];
      const accessToken = Jwt.sign(user_id, email, nickname);

      return accessToken;
    } catch (err: any) {
      throw err;
    }
  };

  /** 회원가입 비즈니스 로직 */
  static register = async (userDTO: RegisterUserDTO) => {
    try {
      /** 패스워드 암호화 */
      const hashedPassword = await Secure.encryptToHash(userDTO.password);
      userDTO.password = hashedPassword;

      /** 유저 고유아이디 생성 */
      const userId = Secure.getUUID();

      await AuthModel.register(userId, userDTO);
    } catch (err: any) {
      /** 데이터가 중복된 경우 */
      if (err.code === "ER_DUP_ENTRY") {
        const errMessage = String(err.message);

        /** 이메일이 중복된 경우 */
        if (errMessage.includes(userDTO.email)) {
          throw {
            status: 400,
            code: "auth-004",
            message: "exist_email",
          };
        }

        /** 닉네임이 중복된 경우 */
        if (errMessage.includes(userDTO.nickname)) {
          throw {
            status: 400,
            code: "auth-005",
            message: "exist_nickname",
          };
        }
      }

      throw {
        status: 500,
        message: err.message,
      };
    }
  };
}

export default AuthService;

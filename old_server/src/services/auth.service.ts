import AuthModel from "../models/auth.model";
import { LoginUserDTO, RegisterUserDTO } from "../types/auth";
import Jwt from "../utils/jwt";
import { Mailer } from "../utils/mailer";
import Secure from "../utils/secure";
import app from "../app";

class AuthService {
  /**
   * 인증 - 회원가입 기능 컨트롤러
   * @param {LoginUserDTO} userDTO - 클라이언트에서 입력받은 이메일, 비밀번호
   * @returns - 엑세스토큰, 리프레쉬토큰, 사용자 아이디, 프로필사진, 닉네임 반환
   */
  static login = async (userDTO: LoginUserDTO) => {
    try {
      /** 이메일로 유저정보 확인 */
      const user = await AuthModel.findUserByEmail(userDTO.email);

      /** 사용자를 찾을 수 없는 경우 */
      if (user.length === 0) {
        throw Object.assign(new Error(), {
          status: 400,
          message: "Bad Request",
          description: "Email is do not exist or Password is invalid",
          data: {
            action: "login",
            parameter: userDTO.email,
            message: "invalid_email_or_password",
          },
        });
      }

      /** 인증받지 않은 유저가 로그인 할 경우 */
      const userVerifiedFlag = user[0].is_verified_flag;

      if (userVerifiedFlag === 0) {
        throw Object.assign(new Error(), {
          status: 401,
          message: "Unauthorized",
          description: "Not authorized user",
          data: {
            action: "login",
            parameter: userDTO.email,
            message: "unauthorized_user",
          },
        });
      }

      /** 비밀번호가 일치하지 않은경우 */
      const isSamePassword = await Secure.compareHash(userDTO.password, user[0].password);
      if (!isSamePassword) {
        throw Object.assign(new Error(), {
          status: 400,
          message: "Bad Request",
          description: "Email is do not exist or Password is invalid",
          data: {
            action: "login",
            parameter: userDTO.email,
            message: "invalid_email_or_password",
          },
        });
      }

      /** accessToken, refreshToken 발행 */
      const accessToken = Jwt.sign("access", user[0].user_id);
      const refreshToken = Jwt.sign("refresh", user[0].user_id);

      /** 로그인시 생성되는 토큰을 전역변수에 저장 */
      // TODO: 토큰 저장공간 redis로 이관 필요
      const userTokens = {
        [user[0].user_id]: {
          accessToken,
          refreshToken,
        },
      };
      app.set("tokens", Object.assign(app.get("tokens"), userTokens));

      return {
        accessToken,
        refreshToken,
        userId: user[0].user_id,
        profileImg: user[0].profile_img,
        nickname: user[0].nickname,
      };
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

      /** 이메일 인증을 위힌 토큰 생성 */
      const emailVerifyToken = Secure.getUUID();

      /** 회원가입 데이터 추가 */
      await AuthModel.register(userId, userDTO, emailVerifyToken);

      /** 인증 관련 메일 발송 */
      await Mailer.sendVerifyToken(userDTO.email, userDTO.nickname, emailVerifyToken);

      return userId;
    } catch (err: any) {
      /** 데이터가 중복된 경우 */
      if (err.code === "ER_DUP_ENTRY") {
        const errMessage = String(err.message);

        /** 이메일이 중복된 경우 */
        if (errMessage.includes(userDTO.email)) {
          throw Object.assign(new Error(), {
            status: 400,
            message: "Bad Request",
            description: "Email is already in use",
            data: {
              action: "register",
              parameter: userDTO.email,
              message: "exist_email",
            },
          });
        }

        /** 닉네임이 중복된 경우 */
        if (errMessage.includes(userDTO.nickname)) {
          throw Object.assign(new Error(), {
            status: 400,
            message: "Bad Request",
            description: "Nickname is already in use",
            data: {
              action: "register",
              parameter: userDTO.nickname,
              message: "exist_nickname",
            },
          });
        }
      }

      throw err;
    }
  };

  /** 회원가입 비즈니스 로직 */
  static adminRegister = async (userDTO: RegisterUserDTO) => {
    try {
      /** 패스워드 암호화 */
      const hashedPassword = await Secure.encryptToHash(userDTO.password);
      userDTO.password = hashedPassword;

      /** 유저 고유아이디 생성 */
      const userId = Secure.getUUID();

      await AuthModel.adminRegister(userId, userDTO);
      return userId;
    } catch (err: any) {
      /** 데이터가 중복된 경우 */
      if (err.code === "ER_DUP_ENTRY") {
        const errMessage = String(err.message);

        /** 이메일이 중복된 경우 */
        if (errMessage.includes(userDTO.email)) {
          throw Object.assign(new Error(), {
            status: 400,
            message: "Bad Request",
            description: "Email is already in use",
            data: {
              action: "register",
              parameter: userDTO.email,
              message: "exist_email",
            },
          });
        }

        /** 닉네임이 중복된 경우 */
        if (errMessage.includes(userDTO.nickname)) {
          throw Object.assign(new Error(), {
            status: 400,
            message: "Bad Request",
            description: "Nickname is already in use",
            data: {
              action: "register",
              parameter: userDTO.nickname,
              message: "exist_nickname",
            },
          });
        }
      }

      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static verify = async (verifyToken: string) => {
    /** 파라미터에서 토큰을 찾을 수 없을때 */
    if (!verifyToken) {
      throw Object.assign(new Error(), {
        status: 404,
        message: "Not Found",
        description: "Verify token not found",
        data: {
          action: "verify",
          parameter: verifyToken,
          message: "verfiy_token_not_found",
        },
      });
    }

    try {
      await AuthModel.verify(verifyToken);
    } catch (err: any) {
      throw err;
    }
  };

  static token = async (accessToken: string, refreshToken: string) => {
    try {
      const decodedToken = Jwt.verify(refreshToken);

      if (decodedToken) {
        const userId = decodedToken.userId;
        const existTokens = app.get("tokens");
        const userToken = existTokens[userId];

        /** 서버에 유저 아이디로 저장된 토큰이 없을경우 */
        if (!userToken) {
          throw {
            status: 401,
            code: "auth-009",
            message: "invalid_token",
          };
        }

        /** 저장된 토큰은 있으나 토큰값이 일치하지 않는경우 */
        if (!(userToken.accessToken === accessToken && userToken.refreshToken === refreshToken)) {
          throw {
            status: 401,
            code: "auth-009",
            message: "invalid_token",
          };
        }

        const token = Jwt.sign("access", userId);
        return token;
      }
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * 로그아웃 서비스 로직
   * @param {string} userId - 로그인된 유저를 식별하기 위한 아이디
   * @param {string} accessToken - 현재 로그인된 유저의 엑세스 토큰
   */
  // TODO: token 저장공간 redis로 이관필요
  static logout = (userId: string, accessToken: string) => {
    try {
      const userTokens = app.get("tokens")[userId];

      /** 서버에 저장된 유저의 토큰이 없을경우 */
      if (!userTokens) {
        return;
      }

      /** 서버에 저장된 유저의 토큰과 전달받은 토큰이 없을경우*/
      if (userTokens.accessToken !== accessToken) {
        return;
      }

      /** 유저 아이디와 엑세스 토큰이 일치한경우 서버에서 로그아웃 처리 */
      delete app.get("tokens")[userId];
    } catch (err: any) {
      throw err;
    }
  };
}

export default AuthService;

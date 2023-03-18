import axios from "axios";
import { LOGIN_URL, REGISTER_URL, TOKEN_URL, LOGOUT_URL, VERIFY_URL } from "../config/api";
import { errorHandler } from "./errorHandler";

export class AuthService {
  /**
   * 회원가입 서비스 로직
   * @param email - 회원가입에 사용될 이메일
   * @param password - 회원가입에 사용될 비밀번호
   * @param nickname - 회원가입에 사용될 닉네임
   * @returns API 응답
   */
  static register = async (email: string, password: string, nickname: string) => {
    try {
      const res = await axios.post(REGISTER_URL, { email, password, nickname });
      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 로그인 서비스 로직
   * @param email - 로그인에 사용될 이메일
   * @param password - 로그인에 사용될 비밀번호
   * @returns API 응답
   */
  static login = async (email: string, password: string) => {
    try {
      const res = await axios.post(LOGIN_URL, { email, password });

      const { accessToken, refreshToken, userId, profileImg, nickname } = res.data;

      /** 로컬스토리지에 관련된 데이터 저장 */
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("profileImg", profileImg);
      localStorage.setItem("nickname", nickname);

      return res;
    } catch (err: any) {
      errorHandler(err);
    }
  };

  /**
   * 로그아웃 서비스 로직
   * @param {string} userId - 로그아웃을 위해 서버로 전달될 유저의 아이디
   * @param {string} accessToken - 로그아웃을 위해 서버로 전달될 엑세스 토큰
   * @returns API 응답
   */
  static logout = async (userId: string, accessToken: string) => {
    try {
      const res = await axios.get(`${LOGOUT_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileImg");
      localStorage.removeItem("nickname");

      return res;
    } catch (err: any) {
      errorHandler(err);
    }
  };

  static token = async (accessToken: string, refreshToken: string) => {
    try {
      const res = await axios.post(TOKEN_URL, { accessToken, refreshToken });

      if (res.status === 200) {
        return res.data.token;
      }
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * 이메일 인증 서비스 로직
   * @param verifyToken - 이메일 인증에 사용될 유저의 고유 인증코드
   * @returns API 응답
   */
  static verify = async (verifyToken: string) => {
    console.log(verifyToken);

    try {
      const res = await axios.get(`${VERIFY_URL}/${verifyToken}`);
      return res;
    } catch (err: any) {
      errorHandler(err);
    }
  };
}

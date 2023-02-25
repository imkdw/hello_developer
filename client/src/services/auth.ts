import axios from "axios";
import { LOGIN_URL, REGISTER_URL, TOKEN_URL, LOGOUT_URL, VERIFY_URL } from "../config/api";

/** 센트리 */
import * as Sentry from "@sentry/react";
import { LoginServiceReturn } from "../types/auth";

/**
 * 공통된 에러처리를 위한 에러 핸들러
 * @param {any} err - axios 에러 데이터
 */
const errorHandler = (err: any) => {
  console.log(err);

  /** 500에러 또는 상태코드가 없는 에러 발생시 Sentry에 Logging */
  if (err.status === 500 || !err.status) {
    Sentry.captureEvent(err);
  }

  throw Object.assign(new Error(), {
    status: err.response.data.status || 500,
    message: err.response.data.message || "",
    description: err.response.data.description || "",
    data: {
      action: err.response.data.data.action || "",
      parameter: err.response.data.data.parameter || "",
      message: err.response.data.data.message || "",
    },
  });
};

export class AuthService {
  /**
   * 회원가입 서비스 로직
   * @param {string} email - 회원가입에 사용될 이메일
   * @param {string} password - 회원가입에 사용될 비밀번호
   * @param {string} nickname - 회원가입에 사용될 닉네임
   * @returns {Promise<number>} API 응답 코드
   */
  static register = async (email: string, password: string, nickname: string): Promise<number> => {
    try {
      const res = await axios.post(REGISTER_URL, { email, password, nickname });
      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 로그인 서비스 로직
   * @param {string} email - 로그인에 사용될 이메일
   * @param {string} password - 로그인에 사용될 비밀번호
   * @returns {Promise<number>, data} API 응답 코드 및 토큰 등 반환값
   */
  static login = async (email: string, password: string): Promise<LoginServiceReturn> => {
    try {
      const res = await axios.post(LOGIN_URL, { email, password });

      const { accessToken, refreshToken, userId, profileImg, nickname } = res.data;

      /** 로컬스토리지에 관련된 데이터 저장 */
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);
      localStorage.setItem("profileImg", profileImg);
      localStorage.setItem("nickname", nickname);

      return {
        status: res.status,
        data: res.data,
      };
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 로그아웃 서비스 로직
   * @param {string} userId - 로그아웃을 위해 서버로 전달될 유저의 아이디
   * @param {string} accessToken - 로그아웃을 위해 서버로 전달될 엑세스 토큰
   * @returns
   */
  static logout = async (userId: string, accessToken: string): Promise<number> => {
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

      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
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
   * @param {string} verifyToken - 이메일 인증에 사용될 유저의 고유 인증코드
   * @returns {Promise<number>} API 응답 코드
   */
  static verify = async (verifyToken: string): Promise<number> => {
    try {
      const res = await axios.get(`${VERIFY_URL}/${verifyToken}`);
      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };
}

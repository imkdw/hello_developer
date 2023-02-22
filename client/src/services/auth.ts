import axios from "axios";
import { LOGIN_URL, REGISTER_URL, TOKEN_URL, LOGOUT_URL } from "../config/api";

export class AuthService {
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

  static register = async (email: string, password: string, nickname: string): Promise<number> => {
    try {
      const res = await axios.post(REGISTER_URL, { email, password, nickname });
      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.message,
      });
    }
  };

  static login = async (email: string, password: string): Promise<{ status: number; data: any }> => {
    try {
      const res = await axios.post(LOGIN_URL, { email, password });

      const { accessToken, refreshToken, userId, profileImg, nickname } = res.data;

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
      console.log(err);
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.message,
      });
    }
  };

  static logout = async (userId: string, accessToken: string) => {
    try {
      const res = await axios.get(`${LOGOUT_URL}/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(res.status);
      if (res.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("profileImg");
        localStorage.removeItem("nickname");
      }

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.message,
      });
    }
  };
}

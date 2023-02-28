import axios from "axios";
import {
  ADD_BOOKMARK_URL,
  DELETE_BOOKMARK_URL,
  EXIT_USER_URL,
  HISTORY_URL,
  USER_PROFILE_IMAGE_UPDATE,
  USER_PROFILE_UPDATE_URL,
  USER_PROFILE_URL,
} from "../config/api";
import { UserProfile, UserProfileUpdateData } from "../types/user";
import * as Sentry from "@sentry/react";

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

export class UserService {
  /**
   * 사용자의 프로필 정보를 불러오는 서비스 로직
   * @param {string} userId - 사용자 아이디
   */
  static profile = async (userId: string): Promise<{ status: number; user: UserProfile }> => {
    try {
      const res = await axios.get(`${USER_PROFILE_URL}/${userId}`);
      return { status: res.status, user: res.data };
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 사용자의 프로필 정보를 업데이트하는 서비스 로직
   * @param {string} userId - 사용자 아이디
   * @param {UserProfileUpdateData} updateData - 업데이트한 유저의 프로필 정보
   * @param {string} accessToken - 유저의 엑세스토큰
   */
  static updateProfile = async (
    userId: string,
    updateData: UserProfileUpdateData,
    accessToken: string
  ): Promise<number> => {
    try {
      const res = await axios.put(
        `${USER_PROFILE_UPDATE_URL}/${userId}`,
        { ...updateData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static uploadImage = async (formData: FormData, accessToken: string) => {
    try {
      const res = await axios.post(`${USER_PROFILE_IMAGE_UPDATE}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      localStorage.setItem("profileImg", res.data.profileImg);

      return { status: res.status, profileImg: res.data.profileImg };
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static addBookmark = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/v1/api/user/bookmark/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static deleteBookmark = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.delete(`${DELETE_BOOKMARK_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static history = async (userId: string, item: string) => {
    try {
      const res = await axios.get(`${HISTORY_URL}/history/${userId}?item=${item}`);
      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static exit = async (password: string, accessToken: string) => {
    try {
      await axios.patch(
        EXIT_USER_URL,
        { password },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      /** 로그인된 유저 정보를 삭제 */
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("profileImg");
      localStorage.removeItem("nickname");
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };
}

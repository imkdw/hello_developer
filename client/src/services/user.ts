import axios from "axios";
import { PROFILE_URL, USER_PROFILE_UPDATE_URL, USER_PROFILE_URL } from "../config/api";
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
      const res = await axios.get(`${PROFILE_URL}/${userId}`);
      return { status: res.status, user: res.data };
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

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
}

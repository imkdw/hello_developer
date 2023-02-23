import axios from "axios";
import { USER_PROFILE_UPDATE_URL, USER_PROFILE_URL } from "../config/api";
import { UserProfileUpdateData } from "../types/user";

export class UserService {
  static profile = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:5000/v1/api/user/${userId}`);
      return { status: res.status, user: res.data };
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static updateProfile = async (userId: string, updateData: UserProfileUpdateData, accessToken: string) => {
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

      return { status: res.status };
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };
}

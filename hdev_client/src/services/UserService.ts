import { UserPasswordUpdateData, UserProfileUpdateData } from "../types/user";
import { api } from "../utils/Common";
import { token } from "./AuthService";

/**
 * [GET] /users/:userId - 사용자 프로필 가져오기
 * @param userId
 * @returns
 */
export const getProfile = async (userId: string) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (err: any) {
    throw err;
  }
};

/**
 * [PATCH] /users/:userId - 사용자 프로필 업데이트
 * @param userId
 * @param updateData
 * @param accessToken
 * @returns
 */
export const updateProfile = async (userId: string, updateData: UserProfileUpdateData, accessToken: string) => {
  try {
    return await api.patch(
      `/users/${userId}`,
      { ...updateData },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err: any) {
    if (err.response.status === 401) {
      const tokenRes = await token();

      const res = await api.patch(
        `/users/${userId}`,
        { ...updateData },
        { headers: { Authorization: `Bearer ${tokenRes.data.accessToken}` } }
      );
      res.data.accessToken = tokenRes.data.accessToken;
      return res;
    }

    throw err;
  }
};

/**
 * [PATCH] /users/:userId/password - 사용자 비밀번호 변경
 * @param userId
 * @param updateData
 * @param accessToken
 * @returns
 */
export const updatePassword = async (userId: string, updateData: UserPasswordUpdateData, accessToken: string) => {
  try {
    return await api.patch(
      `/users/${userId}/password`,
      { ...updateData },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err: any) {
    if (err.response.status === 401) {
      const tokenRes = await token();

      const res = await api.patch(
        `/users/${userId}/password`,
        { ...updateData },
        { headers: { Authorization: `Bearer ${tokenRes.data.accessToken}` } }
      );
      res.data.accessToken = tokenRes.data.accessToken;
      return res;
    }

    throw err;
  }
};

/**
 * [POST] /users/:userId/image - 사용자 프로필사진 업데이트
 * @param userId
 * @param formData
 * @param accessToken
 * @returns
 */
export const updateProfileImage = async (userId: string, formData: FormData, accessToken: string) => {
  try {
    return await api.post(`/users/${userId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err: any) {
    if (err.response.status === 401) {
      const tokenRes = await token();
      const res = await api.post(`/users/${userId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokenRes.data.accessToken}`,
        },
      });
      res.data.accessToken = tokenRes.data.accessToken;
      return res;
    }

    throw err;
  }
};

export const exitUserVerify = async (userId: string, password: string, accessToken: string) => {
  try {
    return await api.patch(
      `/users/${userId}/verify`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err: any) {
    if (err.response.status === 401) {
      const tokenRes = await token();
      const res = await api.patch(
        `/users/${userId}/verify`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${tokenRes.data.accessToken}`,
          },
        }
      );
      res.data.accessToken = tokenRes.data.accessToken;
      return res;
    }

    throw err;
  }
};

export const exitUser = async (userId: string, accessToken: string) => {
  try {
    return await api.delete(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err: any) {
    if (err.response.status === 401) {
      const tokenRes = await token();
      const res = await api.delete(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${tokenRes.data.accessToken}`,
        },
      });
      res.data.accessToken = tokenRes.data.accessToken;
      return res;
    }

    throw err;
  }
};

export const getHistory = async (userId: string, item: "board" | "comment") => {
  try {
    return await api.get(`users/${userId}/history?item=${item}`);
  } catch (err: any) {
    throw err;
  }
};

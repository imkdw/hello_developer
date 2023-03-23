import { UserProfileUpdateData } from "../types/user";
import { api } from "../utils/Common";

export const getProfile = async (userId: string) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (err: any) {
    throw err;
  }
};

export const updateProfile = async (userId: string, updateData: UserProfileUpdateData, accessToken: string) => {
  try {
    return await api.patch(
      `/users/${userId}`,
      { ...updateData },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (err: any) {
    throw err;
  }
};

export const updateProfileImage = async (userId: string, formData: FormData, accessToken: string) => {
  try {
    return await api.post(`/users/${userId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err: any) {
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

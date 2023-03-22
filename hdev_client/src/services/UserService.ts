import { api } from "../utils/Common";

export const getProfile = async (userId: string) => {
  try {
    return await api.get(`/users/${userId}`);
  } catch (err: any) {
    throw err;
  }
};

import { api } from "../utils/Auth";

export const register = async (email: string, password: string, nickname: string) => {
  try {
    return await api.post("/auth/register", { email, password, nickname });
  } catch (err: any) {
    throw err;
  }
};

export const login = async (email: string, password: string) => {
  try {
    return await api.post("/auth/login", { email, password });
  } catch (err: any) {
    throw err;
  }
};

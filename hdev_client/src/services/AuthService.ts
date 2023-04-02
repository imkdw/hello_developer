import { api } from "../utils/Common";

export const register = async (email: string, password: string, nickname: string) => {
  try {
    return await api.post("/auth/register", { email, password, nickname });
  } catch (err: any) {
    throw err;
  }
};

export const verify = async (verifyToken: string) => {
  try {
    return await api.get(`/auth/verify/${verifyToken}`);
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

export const logout = async (userId: string, accessToken: string) => {
  try {
    return await api.get(`/auth/logout/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const token = async () => {
  try {
    const res = await api.get("/auth/token");
    return res;
  } catch (err: any) {
    throw err;
  }
};

export const checkLoggedIn = async (userId: string, accessToken: string) => {
  try {
    return await api.get(`/auth/check/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err: any) {
    console.log("에러발생", err.response);
    if (err.response.status === 401 && err.response.data.message !== "not_logged_in") {
      const tokenRes = await token();
      const res = await api.get(`/auth/check/${userId}`, {
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

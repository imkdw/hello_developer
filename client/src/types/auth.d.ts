export interface LoginServiceReturn {
  status: number;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    profileImg: string;
    nickname: string;
  };
}

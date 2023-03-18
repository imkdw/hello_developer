import { atom } from "recoil";

/** 로그인한 유저의 상태 */
export const loggedInUserState = atom({
  key: "loggedInUserState",
  default: {
    accessToken: "",
    refreshToken: "",
    profileImg: "",
    nickname: "",
    userId: "",
  },
});

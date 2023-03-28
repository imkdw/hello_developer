import { atom } from "recoil";
import { ILoggedInUser } from "../types/auth";
import { persistAtom } from "./persist";

/** 로그인한 유저의 상태 */
export const loggedInUserState = atom<ILoggedInUser>({
  key: "loggedInUserState",
  default: {
    accessToken: "",
    profileImg: "",
    nickname: "",
    userId: "",
  },
  effects_UNSTABLE: [persistAtom],
});

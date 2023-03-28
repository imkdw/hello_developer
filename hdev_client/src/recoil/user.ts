import { atom } from "recoil";
import { IUserInfo } from "../types/user";
import { persistAtom } from "./persist";

export const userInfoState = atom<IUserInfo>({
  key: "userInfoState",
  default: {
    introduce: "",
    profileImg: "",
    nickname: "",
  },
  effects_UNSTABLE: [persistAtom],
});

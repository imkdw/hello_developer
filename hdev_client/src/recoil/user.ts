import { atom } from "recoil";
import { IUserInfo } from "../types/user";

export const userInfoState = atom<IUserInfo>({
  key: "userInfoState",
  default: {
    introduce: "",
    profileImg: "",
    nickname: "",
  },
});

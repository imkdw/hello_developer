import { atom } from "recoil";
import { UserProfile } from "../types/user";

export const userProfileState = atom<UserProfile>({
  key: "userProfileState",
  default: {
    createdAtDate: "",
    email: "",
    introduce: "",
    nickname: "",
    profileImg: "",
    userId: "",
  },
});

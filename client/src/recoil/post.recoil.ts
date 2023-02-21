import { atom } from "recoil";
import { PostDetailData } from "../types/post";

export const postDetailDataState = atom<PostDetailData>({
  key: "postDetailDataState",
  default: {
    user: {
      nickname: "",
      profileImg: "",
    },
    tags: [{ name: "" }],
    createdAt: "",
    comments: [],
    content: "",
    recommendCnt: 0,
    title: "",
    viewCount: 0,
  },
});
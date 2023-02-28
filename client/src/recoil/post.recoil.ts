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
    category: "",
    postId: "",
  },
});

export const currentPostIdState = atom({
  key: "currentPostIdState",
  default: "",
});

export const postOfUserActivityState = atom({
  key: "postOfUserActivityState",
  default: {
    isRecommend: false,
    isBookmark: false,
  },
});

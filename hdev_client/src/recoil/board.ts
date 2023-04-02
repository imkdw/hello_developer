import { atom } from "recoil";
import { BoardData, IBoardDetail } from "../types/board";
import { persistAtom } from "./persist";

// 현재 접속중인 보드
export const currentBoardState = atom({
  key: "currentBoardState",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// 게시글 목록 상단부분에 사용되는 보드데이터
export const boardDataState = atom<BoardData>({
  key: "boardDataState",
  default: {
    notice: {
      title: "공지사항",
      desc: "헬로디벨로퍼의 중요한 공지사항이 업로드되는 공간",
      link: "/notice",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    suggestion: {
      title: "건의사항",
      desc: "헬로디벨로퍼에 관한 요구사항을 건의하는 공간",
      link: "/suggestion",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    free: {
      title: "자유주제",
      desc: "자유로운 주제로 유저들과 소통하는 공간",
      link: "/free",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    knowledge: {
      title: "지식공유",
      desc: "개발과 관련된 각종 지식을을 함께 나누는 공간",
      link: "/knowledge",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "꿀팁",
          link: "/tips",
        },
        {
          text: "리뷰",
          link: "/review",
        },
      ],
    },
    qna: {
      title: "질문답변",
      desc: "개발하면서 궁금한 내용을 질문하고 답변하는 공간",
      link: "/qna",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "기술",
          link: "/tech",
        },
        {
          text: "커리어",
          link: "/career",
        },
      ],
    },
    recruitment: {
      title: "인원모집",
      desc: "다양한 주제로 개발자분들을 모집하는 공간",
      link: "/recruitment",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "프로젝트",
          link: "/project",
        },
        {
          text: "스터디",
          link: "/study",
        },
        {
          text: "채용공고",
          link: "/company",
        },
      ],
    },
  },
});

// 게시글 상세정보 데이터
export const boardDetailState = atom<IBoardDetail>({
  key: "boardDetailState",
  default: {
    boardId: "",
    comments: [],
    content: "",
    createdAt: "",
    recommendCnt: 0,
    tags: [],
    title: "",
    user: {
      nickname: "",
      profileImg: "",
      userId: "",
    },
    view: { viewCnt: 0 },
    category1: { name: "" },
    category2: null,
    recommends: [],
  },
});

export const categoryDataState = atom<{ [key: string]: string }>({
  key: "categoryDataState",
  default: {
    notice: "공지사항",
    suggestion: "건의사항",
    free: "자유주제",
    knowledge: "지식공유",
    tips: "꿀팁",
    review: "리뷰",
    qna: "질문답변",
    tech: "기술",
    career: "커리어",
    recruitment: "인원모집",
    project: "프로젝트",
    study: "스터디",
    company: "채용공고",
  },
});

export const searchKeywordState = atom({
  key: "searchKeywordState",
  default: "",
});

export const updateBoardDataState = atom({
  key: "updateBoardData",
  default: {
    category: "none",
    title: "",
    tags: [{ name: "" }, { name: "" }, { name: "" }],
    content: "",
  },
});

export interface SearchData {}

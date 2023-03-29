// 게시글의 리스트에 헤더 부분 보드데이터의 종류
export interface BoardData {
  [key: string]: {
    title: string;
    desc: string;
    link: string;
    category?: {
      text: string;
      link: string;
    }[];
  };
}

// 게시글 목록 데이터
export interface IBoardItem {
  boardId: string;
  category2: { name: string };
  content: string;
  createdAt: string;
  tags: { name: string }[];
  title: string;
  user: { userId: string; profileImg: string; nickname: string };
  view: { viewCnt: number };
}

// 게시글 상세정보 데이터
export interface IBoardDetail {
  boardId: string;
  comments: {
    comment: string;
    commentId: 1;
    createdAt: string;
    user: {
      nickname: string;
      profileImg: string;
      userId: string;
    };
  }[];
  content: string;
  createdAt: string;
  recommendCnt: number;
  tags: {
    name: string;
  }[];
  title: string;
  user: {
    nickname: string;
    profileImg: string;
    userId: string;
  };
  view: { viewCnt: number };
  category1: { name: string };
  category2: { name: string } | null;
  recommends: { userId: string }[];
}

export interface CreateBoardDto {
  tempBoardId: string;
  category: string;
  title: string;
  tags: {
    name: string;
  }[];
  content: string;
}

export interface UpdateBoardDto {
  category: string;
  title: string;
  tags: {
    name: string;
  }[];
  content: string;
}

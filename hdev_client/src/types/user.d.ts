export interface IUserInfo {
  profileImg: string;
  nickname: string;
  introduce: string;
}

export interface UserProfileUpdateData {
  nickname: string;
  introduce: string;
}

export interface UserPasswordUpdateData {
  password: string;
  rePassword: string;
}

export interface UserBoardHistory {
  category1: { name: string };
  category2: { name: string };
  createdAt: string;
  boardId: string;
  title: string;
}

export interface UserCommentHistory {
  commentId: number;
  board: {
    category1: { name: string };
    category2: { name: string };
    createdAt: string;
    boardId: string;
    title: string;
  };
}

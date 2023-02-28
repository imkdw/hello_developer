export interface UserProfile {
  createdAtDate: string;
  email: string;
  introduce: string;
  nickname: string;
  profileImg: string;
  userId: string;
}

export interface UserProfileUpdateData {
  nickname: string;
  introduce: string;
  password: string;
  rePassword: string;
}

export interface UserHistoryPost {
  category1: number;
  category2: number | null;
  createdAt: string;
  postId: string;
  title: string;
}

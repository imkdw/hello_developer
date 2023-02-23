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

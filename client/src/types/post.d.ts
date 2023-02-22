export interface AddPostData {
  category: string;
  title: string;
  tags: {
    name: string;
  }[];
  content: string;
}

// 게시글 목록
export interface PostListData {
  user: {
    nickname: string;
    profileImg: string;
    userId: string;
  };
  post: {
    postId: string;
    title: string;
    createdAtDate: string;
    content: string;
    tags: [{ name: string }];
    commentCount: number;
    userId: string;
    topic: number;
  };
}

// 게시글 상세보기
export interface PostDetailData {
  user: {
    nickname: string;
    profileImg: string;
  };
  tags: { name: string }[];
  createdAt: string;
  comments: {
    user: {
      nickname: string;
      profileImg: string;
      userId: string;
    };
    commentId: number;
    content: string;
    createdAtDate: string;
    postId: string;
    reComment: [];
    userId: string;
  }[];
  content: string;
  recommendCnt: number;
  title: string;
  viewCount: number;
}

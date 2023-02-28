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
  category: string;
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
    reComment: {
      user: {
        nickname: string;
        profileImg: string;
        userId: string;
      };
      reCommentId: number;
      commentId: number;
      userId: string;
      content: string;
      createdAtDate: string;
      updatedAtDate: string;
    }[];
    userId: string;
  }[];
  content: string;
  recommendCnt: number;
  title: string;
  viewCount: number;
  postId: string;
}

export interface PostDetailDataComments {
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
    reComment: {
      user: {
        nickname: string;
        profileImg: string;
        userId: string;
      };
      reCommentId: number;
      commentId: number;
      userId: string;
      content: string;
      createdAtDate: string;
      updatedAtDate: string;
    }[];
    userId: string;
  };
}

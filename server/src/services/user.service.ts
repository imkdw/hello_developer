import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { HistoryPosts } from "../types/post";
import { AllComments } from "../types/user";

export class UserService {
  static profile = async (userId: string) => {
    try {
      const profile = await UserModel.findUserByUserId(userId);

      if (!profile) {
        throw {
          status: 404,
          code: "user-001",
          message: "user_not_found",
        };
      }
      return profile;
    } catch (err: any) {
      throw err;
    }
  };

  static addBookmark = async (postId: string, userId: string) => {
    try {
      await UserModel.addBookmark(postId, userId);
    } catch (err: any) {
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        throw {
          status: 404,
          code: "user-002",
          message: "bookmark_post_not_found",
        };
      }

      throw {
        status: 500,
        message: err.message,
      };
    }
  };

  static deleteBookmark = async (postId: string, userId: string) => {
    try {
      await UserModel.deleteBookmark(postId, userId);
    } catch (err: any) {
      throw err;
    }
  };

  static history = async (userId: string, item: string) => {
    try {
      let historyPosts: HistoryPosts[] = [];

      switch (item) {
        case "post":
          const posts = await PostModel.findPostByUserId(userId);
          posts.map((post) => {
            historyPosts.push({
              postId: post.post_id,
              category1: post.category_id1,
              category2: post.category_id2,
              title: post.title,
              createdAt: post.created_at_date,
            });
          });
          break;
        case "comment":
          const allComments: AllComments[] = [];
          // 1. 유저 아이디로 댓글목록 조회 및 배열에 저장
          const comments = await PostModel.findCommentByUserId(userId);
          comments.map((comment) => {
            allComments.push({
              postId: comment.post_id,
              createdAt: comment.created_at_date,
            });
          });

          // 2. 유저 아이디로 대댓글 목록 조회
          const reComments = await PostModel.findRecommentByUserId(userId);
          await Promise.all(
            reComments.map(async (recomment) => {
              const comment = await PostModel.findCommentById(recomment.comment_id);
              allComments.push({
                postId: comment[0].post_id,
                createdAt: recomment.created_at_date,
              });
            })
          );

          const sortedComments = allComments.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
          await Promise.all(
            sortedComments.map(async (comment) => {
              const post = await PostModel.findPostByPostId(comment.postId);
              historyPosts.push({
                postId: post.post_id,
                category1: post.category_id1,
                category2: post.category_id2,
                title: post.title,
                createdAt: post.created_at_date,
              });
            })
          );
          break;
        case "bookmark":
          const postIds = await UserModel.findBookmarkPostByUserId(userId);
          await Promise.all(
            postIds.map(async (postId) => {
              const post = await PostModel.findPostByPostId(postId.post_id);
              historyPosts.push({
                postId: post.post_id,
                category1: post.category_id1,
                category2: post.category_id2,
                title: post.title,
                createdAt: post.created_at_date,
              });
            })
          );
          break;
        default:
          throw {
            status: 404,
            code: "user-003",
            message: "history_item_not_found",
          };
      }

      return historyPosts;
    } catch (err: any) {
      throw err;
    }
  };

  static updateProfile = async (userId: string, tokenUserId: string, nickname: string, introduce: string) => {
    try {
      /** 업데이트 해야되는 데이터가 없을경우 400 에러 반환 */
      if (nickname.length === 0 || introduce.length === 0) {
        throw {
          status: 400,
          code: "user-004",
          message: "profile_data_not_found",
        };
      }

      /** 파라미터로 받은 유저의 아이디와 토큰에서 추출한 유저의 아이디가 다른경우 401 에러 반환 */
      if (userId !== tokenUserId) {
        throw {
          status: 401,
          code: "user-005",
          message: "user_mismatch",
        };
      }

      /** 기존 데이터와 새로 입력한 데이터가 일치하는 경우 성공으로 처리 */
      const existingUser = await UserModel.findUserByUserId(tokenUserId);
      if (existingUser.nickname === nickname && existingUser.introduce === introduce) {
        return;
      }

      if (existingUser.nickname !== nickname && existingUser.introduce === introduce) {
        // 닉네임만 업데이트
      } else if (existingUser.nickname === nickname && existingUser.introduce !== introduce) {
        // 소개만 업데이트
      } else {
        // 다 업데이트
      }
    } catch (err: any) {
      throw err;
    }
  };
}

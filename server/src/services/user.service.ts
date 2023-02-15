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
}

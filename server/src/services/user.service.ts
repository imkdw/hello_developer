import { changePropertySnakeToCamel } from "../db/snakeToCamel";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { HistoryPosts } from "../types/post";
import { AllComments, UpdateProfileUserDTO } from "../types/user";
import Secure from "../utils/secure";

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

      return {
        createdAtDate: profile.created_at_date,
        email: profile.email,
        introduce: profile.introduce,
        nickname: profile.nickname,
        profileImg: profile.profile_img,
        userId: profile.user_id,
      };
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

  static updateProfile = async (userId: string, tokenUserId: string, userDTO: UpdateProfileUserDTO) => {
    const updateFields = [];

    if (userDTO.nickname) {
      updateFields.push({ key: "nickname", value: userDTO.nickname });
    }

    if (userDTO.introduce) {
      updateFields.push({ key: "introduce", value: userDTO.introduce });
    }

    if (userDTO.rePassword) {
      updateFields.push({ key: "password", value: await Secure.encryptToHash(userDTO.rePassword) });
    }

    if (updateFields.length === 0) {
      throw {
        status: 400,
        code: "user-004",
        message: "invalid_profile_data",
      };
    }

    if (userId !== tokenUserId) {
      throw {
        status: 401,
        code: "user-005",
        message: "user_mismatch",
      };
    }

    try {
      const existingUser = await UserModel.findUserByUserId(tokenUserId);

      // 변경하고싶은 비밀번호가 존재할경우
      if (userDTO.rePassword) {
        // 기존 비밀번호와 입력받은 비밀번호가 다를경우
        if (!(await Secure.compareHash(userDTO.password, existingUser.password))) {
          throw {
            status: 400,
            code: "user-007",
            message: "password_mismatch",
          };
        }
      }

      const updateFieldQuery = updateFields
        .map((field) => {
          if (field.value !== existingUser[field.key]) {
            return `${field.key} = '${field.value}'`;
          }

          return null;
        })
        .filter((query) => query);

      /** 기존에 존재하던 값과 동일하면 200 코드 반환 */
      if (updateFieldQuery.length === 0) {
        return;
      }

      await UserModel.updateUser(
        tokenUserId,
        updateFieldQuery.length === 1 ? updateFieldQuery.join("") : updateFieldQuery.join(", ") // 값이 여러개면 콤마로 구분하고 아니면 그냥 입력
      );
    } catch (err: any) {
      throw err;
    }
  };

  static exit = async (userId: string, password: string) => {
    try {
      const user = await UserModel.findUserByUserId(userId);

      const isCorrectPassword = await Secure.compareHash(password, user.password);

      // 가입된 유저와 비밀번호가 일치하지 않은경우
      if (!isCorrectPassword) {
        throw {
          status: 400,
          code: "user-006",
          message: "password-mismatch",
        };
      }

      await UserModel.exit(userId);
    } catch (err: any) {
      throw err;
    }
  };
}

import { changePropertySnakeToCamel } from "../db/snakeToCamel";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { HistoryPosts } from "../types/post";
import { AllComments, UpdateProfileUserDTO } from "../types/user";
import { imageUploader } from "../utils/imageUploader";
import Secure from "../utils/secure";

export class UserService {
  static profile = async (userId: string) => {
    if (!userId) {
      throw Object.assign(new Error(), {
        status: 404,
        message: "Bad Request",
        description: "User not found",
        data: {
          action: "user",
          parameter: userId,
          message: "user_not_found",
        },
      });
    }

    try {
      const profile = await UserModel.findUserByUserId(userId);

      if (!profile) {
        throw Object.assign(new Error(), {
          status: 404,
          message: "Bad Request",
          description: "User not found",
          data: {
            action: "user",
            parameter: userId,
            message: "user_not_found",
          },
        });
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
      throw err;
    }
  };

  static deleteBookmark = async (postId: string, userId: string) => {
    try {
      await UserModel.deleteBookmark(postId, userId);
    } catch (err: any) {
      throw err;
    }
  };

  static history = async (userId: string, item: "post" | "comment" | "bookmark") => {
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

    /** 파라미터로 전달받은 유저의 아이디와 로그인한 유저의 아이디가 다를때 */
    if (userId !== tokenUserId) {
      throw Object.assign(new Error(), {
        status: 400,
        message: "Bad Reqeust",
        description: "The user who requested the update does not match",
        data: {
          action: "user",
          parameter: "",
          message: "user_not_match",
        },
      });
    }

    /** 프로필 업데이트에 필요한 데이터가 없을때 */
    if (updateFields.length === 0) {
      throw Object.assign(new Error(), {
        status: 404,
        message: "Not Found",
        description: "Unable to find data required for profile update",
        data: {
          action: "user",
          parameter: "",
          message: "profile_data_not_found",
        },
      });
    }

    try {
      const existingUser = await UserModel.findUserByUserId(tokenUserId);

      // 변경하고싶은 비밀번호가 존재할경우
      if (userDTO.rePassword) {
        // 기존 비밀번호와 입력받은 비밀번호가 다를경우
        if (!(await Secure.compareHash(userDTO.password, existingUser.password))) {
          throw Object.assign(new Error(), {
            status: 400,
            message: "Bad Reqeust",
            description: "Your existing passwords do not match",
            data: {
              action: "user",
              parameter: "",
              message: "password_not_match",
            },
          });
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

      // 가입된 유저와 비밀번호가 일치하지 않은경우
      const isCorrectPassword = await Secure.compareHash(password, user.password);
      if (!isCorrectPassword) {
        throw Object.assign(new Error(), {
          status: 400,
          message: "Bad Reqeust",
          description: "The password doesn't match.",
          data: {
            action: "user",
            parameter: "",
            message: "password_not_match",
          },
        });
      }

      await UserModel.exit(userId);
    } catch (err: any) {
      throw err;
    }
  };

  static image = async (userId: string, files: { [fieldname: string]: Express.Multer.File[] } | undefined) => {
    if (!files) {
      throw Object.assign(new Error(), {
        status: 404,
        message: "Not Found",
        description: "Image not found",
        data: {
          action: "user",
          parameter: "",
          message: "image_not_found",
        },
      });
    }

    const ext = files["image"][0].originalname.split(".");
    const fileName = userId + "." + ext[ext.length - 1];

    try {
      /** AWS S3에 이미지 업로드 후 URL 가져옴 */
      const imageUrl = await imageUploader(fileName, files["image"][0].buffer);

      /** 이미지를 업로드한 S3 URL로 유저 프로필정보 수정 */
      await UserModel.image(userId, imageUrl);

      return imageUrl;
    } catch (err: any) {
      throw err;
    }
  };
}

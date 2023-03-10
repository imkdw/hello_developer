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
          // 1. ?????? ???????????? ???????????? ?????? ??? ????????? ??????
          const comments = await PostModel.findCommentByUserId(userId);
          comments.map((comment) => {
            allComments.push({
              postId: comment.post_id,
              createdAt: comment.created_at_date,
            });
          });

          // 2. ?????? ???????????? ????????? ?????? ??????
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

    /** ??????????????? ???????????? ????????? ???????????? ???????????? ????????? ???????????? ????????? */
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

    /** ????????? ??????????????? ????????? ???????????? ????????? */
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

      // ?????????????????? ??????????????? ???????????????
      if (userDTO.rePassword) {
        // ?????? ??????????????? ???????????? ??????????????? ????????????
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

      /** ????????? ???????????? ?????? ???????????? 200 ?????? ?????? */
      if (updateFieldQuery.length === 0) {
        return;
      }

      await UserModel.updateUser(
        tokenUserId,
        updateFieldQuery.length === 1 ? updateFieldQuery.join("") : updateFieldQuery.join(", ") // ?????? ???????????? ????????? ???????????? ????????? ?????? ??????
      );
    } catch (err: any) {
      throw err;
    }
  };

  static exit = async (userId: string, password: string) => {
    try {
      const user = await UserModel.findUserByUserId(userId);

      // ????????? ????????? ??????????????? ???????????? ????????????
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
      /** AWS S3??? ????????? ????????? ??? URL ????????? */
      const imageUrl = await imageUploader(fileName, files["image"][0].buffer);

      /** ???????????? ???????????? S3 URL??? ?????? ??????????????? ?????? */
      await UserModel.image(userId, imageUrl);

      return imageUrl;
    } catch (err: any) {
      throw err;
    }
  };
}

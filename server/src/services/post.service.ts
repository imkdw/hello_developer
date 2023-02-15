import { changePropertySnakeToCamel } from "../db/snakeToCamel";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { AddPostUserDTO, FindPostByCategoryIdReturn } from "../types/post";
import Secure from "../utils/secure";

export class PostService {
  static add = async (userId: string, userDTO: AddPostUserDTO) => {
    const postId = Secure.getUUID();

    try {
      /** 기존에 존재하는 카테고리인지 확인 */
      const category = userDTO.category.split("-");
      const categoryId = await Promise.all(
        category.map(async (item) => {
          try {
            const categoryId = await PostModel.findCategoryIdByName(item);
            return categoryId?.category_id;
          } catch (err: any) {
            throw err;
          }
        })
      );

      /** 이상한 카테고리를 받았을경우 에러 반환 */
      categoryId.forEach((id) => {
        if (!id) {
          throw {
            status: 400,
            code: "post-001",
            message: "unknown_category",
          };
        }
        return;
      });

      /** 데이터 삽입 */
      await PostModel.add(userId, postId, categoryId, userDTO);
      return postId;
    } catch (err: any) {
      throw err;
    }
  };

  static list = async (category1: string, category2: string) => {
    try {
      /** 1. 카테고리 아이디 가져오기 */
      const categoryIds = await Promise.all(
        [category1, category2].map(async (category) => {
          const categoryId = await PostModel.findCategoryIdByName(category);
          return categoryId;
        })
      );

      /** 첫번째 카테고리가 존재하지 않는경우엔 에러 반환 */
      if (!categoryIds[0]) {
        throw {
          status: 400,
          code: "post-002",
          message: "unknown_category",
        };
      }

      /** 2. 카데고리로 게시글 가져오기 */
      const [categoryId1, categoryId2] = [
        categoryIds[0].category_id,
        categoryIds[1] ? categoryIds[1].category_id : undefined,
      ];

      const posts = await PostModel.findPostByCategoryId(categoryId1, categoryId2);

      /** 게시물이 없을경우 빈 배열 반환*/
      if (posts.length === 0) {
        return [];
      }

      /** 3. 사용자정보(닉네임, 프로필사진) 가져오기 */
      const userInfo = await Promise.all(
        posts.map(async (post) => {
          const user = await UserModel.findUserByUserId(post.user_id);
          return changePropertySnakeToCamel({ nickname: user.nickname, profileImg: user.profile_img });
        })
      );

      /** 4. 태그 가져오기 */
      const tags = await Promise.all(
        posts.map(async (post) => {
          const tagIds = await PostModel.findTagIdByPostId(post.post_id);

          const tagNames = await Promise.all(
            tagIds.map(async (tagId) => {
              const tagName = await PostModel.findTagNameById(tagId.tag_id);
              return tagName;
            })
          );

          return tagNames;
        })
      );

      /** 5. 게시글 댓글 가져오기 */
      let allComments = await Promise.all(
        posts.map(async (post) => {
          const commentItem = [];

          const comments = await PostModel.findCommentByPostId(post.post_id);
          commentItem.push(comments);

          const reComments = await Promise.all(
            comments.map(async (comment) => {
              const reComments = await PostModel.findReCommentByCommentId(comment.comment_id);
              return reComments;
            })
          );
          commentItem.push(reComments);
          return commentItem;
        })
      );

      /** 게시글의 총 댓글 갯수 */
      const allCommentCount = allComments.map((comment) => {
        const commentCount = comment[0].length;

        let reCommentCount = 0;
        /** 대댓글이 달린 경우만 갯수 카운트 */
        if (comment[1][0]) {
          reCommentCount = comment[1][0].length;
        }

        return commentCount + reCommentCount;
      });

      /** 6. 게시글에 태그 추가 */
      const postData = posts.map((post, index) => {
        return {
          user: userInfo[index],
          ...changePropertySnakeToCamel(post),
          tags: tags[index],
          commentCount: allCommentCount[index],
        };
      });

      return {
        posts: postData,
      };
    } catch (err: any) {
      throw err;
    }
  };

  static detail = async (postId: string) => {
    try {
      /** 게시글 정보 */
      const post = await PostModel.findPostByPostId(postId);

      /** 유저 정보 */
      const user = await UserModel.findUserByUserId(post.user_id);

      /** 태그 이름 */
      const tagIds = await PostModel.findTagIdByPostId(post.post_id);
      const tagNames = await Promise.all(
        tagIds.map(async (tagId) => {
          const tagName = await PostModel.findTagNameById(tagId.tag_id);
          return tagName;
        })
      );

      /** 댓글 목록 */
      const comments = await PostModel.findCommentByPostId(post.post_id);

      let allComments: any = [];
      /** 대댓글 추가하기 */
      await Promise.all(
        comments.map(async (comment) => {
          const commentUser = await UserModel.findUserByUserId(comment.user_id);
          const reComments = await PostModel.findReCommentByCommentId(comment.comment_id);

          const reCommentWithUser = await Promise.all(
            reComments.map(async (reComment) => {
              const reCommentUser = await UserModel.findUserByUserId(reComment.user_id);
              return {
                user: {
                  nickname: reCommentUser.nickname,
                  profileImg: reCommentUser.profile_img,
                },
                ...reComment,
              };
            })
          );

          allComments.push({
            user: {
              nickname: commentUser.nickname,
              profileImg: commentUser.profile_img,
            },
            ...comment,
            reComment: reCommentWithUser,
          });
        })
      );

      return {
        user: {
          profileImg: user.profile_img,
          nickname: user.nickname,
        },
        title: post.title,
        createdAt: post.created_at_date,
        content: post.content,
        tags: tagNames,
        comments: allComments,
      };
    } catch (err: any) {
      throw err;
    }
  };

  static addComment = async (userId: string, postId: string, comment: string) => {
    try {
      /** 댓글이 비어있을 경우 */
      if (comment.length === 0) {
        throw {
          status: 400,
          code: "post-003",
          message: "invalid_comment",
        };
      }

      const commentId = await PostModel.addComment(userId, postId, comment);
      return commentId;
    } catch (err: any) {
      throw err;
    }
  };

  static addRecomment = async (userId: string, commentId: string, reComment: string) => {
    try {
      /** 댓글이 비어있을 경우 */
      if (reComment.length === 0) {
        throw {
          status: 400,
          code: "post-004",
          message: "invalid_re_comment",
        };
      }

      const reCommentId = await PostModel.addReComment(userId, commentId, reComment);
      return reCommentId;
    } catch (err: any) {
      throw err;
    }
  };

  static deletePost = async (userId: string, postId: string) => {
    try {
      await PostModel.deletePost(userId, postId);
    } catch (err: any) {
      throw err;
    }
  };

  static deleteComment = async (userId: string, commentId: number) => {
    try {
      await PostModel.deleteComment(userId, commentId);
    } catch (err: any) {
      throw err;
    }
  };

  static deleteReComment = async (userId: string, reCommentId: number) => {
    try {
      await PostModel.deleteReComment(userId, reCommentId);
    } catch (err: any) {
      throw err;
    }
  };
}

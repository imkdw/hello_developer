import { changePropertySnakeToCamel } from "../db/snakeToCamel";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";
import { AddPostUserDTO, AllComments, FindPostByCategoryIdReturn, UpdatePostUserDTO } from "../types/post";
import Secure from "../utils/secure";

export class PostService {
  /**
   * 게시글 추가 서비스 로직
   * @param userId - 게시글 추가를 요청한 유저의 아이디
   * @param {AddPostUserDTO} userDTO - 게시글 내용을 담은 userDTO
   * @returns {postId} - 게시글 아이디 반환
   */
  static add = async (userId: string, userDTO: AddPostUserDTO) => {
    const postId = Secure.getUUID();

    try {
      /** 전달받은 카테고리 텍스트로 ID를 가져옴 */
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

      /** 첫번째 카테고리가 존재하지 않는경우 */
      if (!categoryIds[0]) {
        return [];
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
          user: { ...userInfo[index], userId: post.user_id },
          post: {
            ...changePropertySnakeToCamel(post),
            category2,
            tags: tags[index],
            commentCount: allCommentCount[index],
            topic: post.category_id2,
          },
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

      if (!post) {
        throw Object.assign(new Error(), {
          status: 404,
          message: "Not Found",
          description: "Post not found",
          data: {
            action: "post",
            parameter: postId,
            message: "post_not_found",
          },
        });
      }

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

      let allComments: AllComments[] = [];
      /** 대댓글 추가하기 */
      await Promise.all(
        comments.map(async (comment) => {
          const commentUser = await UserModel.findUserByUserId(comment.user_id);
          const reComments = await PostModel.findReCommentByCommentId(comment.comment_id);

          const reCommentWithUser = await Promise.all(
            reComments.map(async (reComment) => {
              const reCommentUser = await UserModel.findUserByUserId(reComment.user_id);

              // user, {...reComment Data}
              return {
                user: {
                  nickname: reCommentUser.nickname,
                  profileImg: reCommentUser.profile_img,
                  userId: reCommentUser.user_id,
                },
                ...reComment,
              };
            })
          );

          allComments.push({
            user: {
              nickname: commentUser.nickname,
              profileImg: commentUser.profile_img,
              userId: commentUser.user_id,
            },
            ...changePropertySnakeToCamel(comment),
            reComment: reCommentWithUser.map((data) => changePropertySnakeToCamel(data)),
          });
        })
      );

      // 댓글 ID 기준으로 정렬
      allComments.sort((a, b) => {
        return a.comment_id - b.comment_id;
      });

      /** 카테고리 */
      const categorys = await Promise.all(
        [post.category_id1, post.category_id2].map(async (categoryId) => {
          const category = await PostModel.findCategoryNameById(categoryId);

          if (category) {
            return category.name;
          }
        })
      );

      const categoryText = categorys.filter((category) => category).length === 1 ? categorys[0] : categorys.join("-");

      /** 조회수 */
      const viewCnt = await PostModel.findViewCntByPostId(postId);
      const viewCntNumber = viewCnt.view_cnt;

      return {
        user: {
          profileImg: user.profile_img,
          nickname: user.nickname,
        },
        title: post.title,
        category: categoryText,
        createdAt: post.created_at_date,
        content: post.content,
        tags: tagNames,
        comments: allComments,
        recommendCnt: post.recommend_cnt,
        viewCount: viewCntNumber,
        postId: post.post_id,
      };
    } catch (err: any) {
      throw err;
    }
  };

  static addComment = async (userId: string, postId: string, comment: string) => {
    try {
      const commentId = await PostModel.addComment(userId, postId, comment);
      return commentId;
    } catch (err: any) {
      throw err;
    }
  };

  static addRecomment = async (userId: string, commentId: string, reComment: string) => {
    try {
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

  static addRecommend = async (userId: string, postId: string) => {
    try {
      await PostModel.addRecommend(userId, postId);
    } catch (err: any) {
      throw err;
    }
  };

  static deleteRecommend = async (userId: string, postId: string) => {
    try {
      await PostModel.deleteRecommend(userId, postId);
    } catch (err: any) {
      throw err;
    }
  };

  static views = async (postId: string) => {
    try {
      await PostModel.views(postId);
    } catch (err: any) {
      throw err;
    }
  };

  static updateComment = async (commentId: string, comment: string) => {
    try {
      await PostModel.updateComment(commentId, comment);
    } catch (err: any) {
      throw err;
    }
  };

  static updateReComment = async (reCommentId: string, reComment: string) => {
    try {
      await PostModel.updateReComment(reCommentId, reComment);
    } catch (err: any) {
      throw err;
    }
  };

  // TODO: 게시글 업데이트로직 재구성 필요
  static updatePost = async (userId: string, postId: string, userDTO: UpdatePostUserDTO) => {
    const { category } = userDTO;
    try {
      const categoryIds = await Promise.all(
        category.split("-").map(async (category) => {
          const categoryId = await PostModel.findCategoryIdByName(category);

          if (!categoryId) {
            return null;
          }

          return categoryId.category_id;
        })
      );

      await PostModel.updatePost(userId, postId, userDTO, categoryIds);
    } catch (err: any) {
      throw err;
    }
  };

  static postUserActivity = async (postId: string, userId: string) => {
    try {
      let isRecommend = false;
      let isBookmark = false;

      const recommendation = await PostModel.findRecommendationByPostAndUserId(postId, userId);
      if (recommendation) {
        isRecommend = true;
      }

      const bookmark = await PostModel.findBookmarkByPostAndUserId(postId, userId);
      if (bookmark) {
        isBookmark = true;
      }

      return { isRecommend, isBookmark };
    } catch (err: any) {
      throw err;
    }
  };
}

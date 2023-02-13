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
      // TODO: 댓글 가져오는 로직 구현필요

      /** 6. 게시글에 태그 추가 */
      const postData = posts.map((post, index) => {
        return {
          user: userInfo[index],
          ...changePropertySnakeToCamel(post),
          tags: tags[index],
        };
      });

      return {
        posts: postData,
      };
    } catch (err: any) {
      throw err;
    }
  };
}

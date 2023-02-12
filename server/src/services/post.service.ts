import { PostModel } from "../models/post.model";
import { AddPostUserDTO } from "../types/post";
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
}

import axios from "axios";
import {
  ADD_COMMENT_URL,
  ADD_POST_URL,
  ADD_RE_COMMENT_URL,
  POST_DETAIL_URL,
  POST_LIST_URL,
} from "../config/api";
import { AddPostData } from "../types/post";

export class PostService {
  static add = async (accessToken: string, postData: AddPostData) => {
    try {
      const res = await axios.post(
        ADD_POST_URL,
        { ...postData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static list = async (category1: string, category2: string) => {
    try {
      const res = await axios.get(`${POST_LIST_URL}?category1=${category1}&category2=${category2}`);
      return { status: res.status, posts: res.data.posts };
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static detail = async (postId?: string) => {
    if (!postId) {
      throw {
        status: 404,
        code: "post-005",
        message: "post_not_found",
      };
    }

    try {
      const res = await axios.get(`${POST_DETAIL_URL}/${postId}`);
      return { status: res.status, post: res.data };
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static addComment = async (postId: string, comment: string, accessToken: string) => {
    try {
      const res = await axios.post(
        ADD_COMMENT_URL,
        { postId, comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static addReComment = async (commentId: number, reComment: string, accessToken: string) => {
    try {
      const res = await axios.post(
        ADD_RE_COMMENT_URL,
        { commentId, reComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };
}

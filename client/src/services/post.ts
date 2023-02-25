import axios from "axios";
import {
  ADD_COMMENT_URL,
  ADD_POST_URL,
  ADD_RE_COMMENT_URL,
  DELETE_COMMENT_URL,
  DELETE_POST_URL,
  DELETE_RE_COMMENT_URL,
  POST_DETAIL_URL,
  POST_LIST_URL,
  UPDATE_COMMENT_URL,
  UPDATE_POST_URL,
  UPDATE_RE_COMMENT_URL,
} from "../config/api";
import { AddPostData } from "../types/post";
import * as Sentry from "@sentry/react";

/**
 * 공통된 에러처리를 위한 에러 핸들러
 * @param {any} err - axios 에러 데이터
 */
const errorHandler = (err: any) => {
  console.log(err);

  /** 500에러 또는 상태코드가 없는 에러 발생시 Sentry에 Logging */
  if (err.status === 500 || !err.status) {
    Sentry.captureEvent(err);
  }

  throw Object.assign(new Error(), {
    status: err.response.data.status || 500,
    message: err.response.data.message || "",
    description: err.response.data.description || "",
    data: {
      action: err.response.data.data.action || "",
      parameter: err.response.data.data.parameter || "",
      message: err.response.data.data.message || "",
    },
  });
};

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
      throw Object.assign(new Error(), {
        status: 404,
        code: "post-005",
        message: "post_not_found",
      });
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

  static delete = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.delete(`${DELETE_POST_URL}/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static update = async (updateData: AddPostData, postId: string, accessToken: string) => {
    try {
      const res = await axios.put(
        `${UPDATE_POST_URL}/${postId}`,
        { ...updateData },
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

  static deleteComment = async (commentId: number, accessToken: string) => {
    try {
      const res = await axios.delete(`${DELETE_COMMENT_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static deleteReComment = async (recommentId: number, accessToken: string) => {
    try {
      const res = await axios.delete(`${DELETE_RE_COMMENT_URL}/${recommentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status;
    } catch (err: any) {
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static updateComment = async (commetId: number, content: string, accessToken: string) => {
    try {
      const res = await axios.put(
        `${UPDATE_COMMENT_URL}/${commetId}`,
        { commentText: content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      console.error(err);
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };

  static updateReComment = async (commetId: number, content: string, accessToken: string) => {
    try {
      const res = await axios.put(
        `${UPDATE_RE_COMMENT_URL}/${commetId}`,
        { reCommentText: content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      console.error(err);
      throw Object.assign(new Error(), {
        status: err.response.status,
        code: err.response.data.code,
        message: err.response.data.me,
      });
    }
  };
}

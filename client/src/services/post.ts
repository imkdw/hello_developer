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
  POST_RECOMMENDATION_URL,
  POST_USER_ACTIVITY_URL,
  POST_VIEW_COUNT_URL,
  UPDATE_COMMENT_URL,
  UPDATE_POST_URL,
  UPDATE_RE_COMMENT_URL,
} from "../config/api";
import { AddPostData } from "../types/post";
import { errorHandler } from "./errorHandler";

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

      return res;
    } catch (err: any) {
      errorHandler(err);
    }
  };

  static list = async (category1: string, category2: string) => {
    try {
      const res = await axios.get(`${POST_LIST_URL}?category1=${category1}&category2=${category2}`);
      return { status: res.status, posts: res.data.posts };
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  static detail = async (postId?: string) => {
    if (!postId) {
      throw Object.assign(new Error(), {
        statusCode: 404,
        message: "board_not_found",
      });
    }

    try {
      const res = await axios.get(`${POST_DETAIL_URL}/${postId}`);
      return { status: res.status, post: res.data };
    } catch (err: any) {
      errorHandler(err);
      throw err;
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
      errorHandler(err);
      throw err;
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
      errorHandler(err);
      throw err;
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
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 게시글 업데이트 로직
   * @param updateData - 업데이트를 요청할 게시글 데이터
   * @param postId  - 업데이트할 게시글의 아이디
   * @param accessToken - 엑세스 토큰
   * @returns {status} - API 응답 상태코드
   */
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
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 댓글 삭제 로직
   * @param commentId - 삭제할 댓글 아이디
   * @param accessToken - 엑세스 토큰
   * @returns {status} - API 응답 상태코드
   */
  static deleteComment = async (commentId: number, accessToken: string) => {
    try {
      const res = await axios.delete(`${DELETE_COMMENT_URL}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
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
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 댓글 업데이트 로직
   * @param commetId - 업데이트할 댓글 아이디
   * @param comment - 댓글 내용
   * @param accessToken - 엑세스 토큰
   * @returns {status} - API 응답 상태코드
   */
  static updateComment = async (commetId: number, comment: string, accessToken: string) => {
    try {
      const res = await axios.put(
        `${UPDATE_COMMENT_URL}/${commetId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 답글 업데이트 로직
   * @param commetId - 업데이트할 답글 아이디
   * @param content - 답글 내용
   * @param accessToken - 엑세스 토큰
   * @returns {status} - API 응답 상태코드
   */
  static updateReComment = async (commetId: number, content: string, accessToken: string) => {
    try {
      const res = await axios.put(
        `${UPDATE_RE_COMMENT_URL}/${commetId}`,
        { reComment: content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.status;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 게시글 조회수 추가 로직
   * @param {string} postId - 조회수를 추가하고자 하는 게시글 아이디
   * @param {string} accessToken - 엑세스토큰
   */
  static addViewCount = async (postId: string, accessToken: string) => {
    try {
      await axios.patch(
        `${POST_VIEW_COUNT_URL}/${postId}/views`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 게시글 추천 추가 로직
   * @param postId - 추천을 하고자하는 게시글 아이디
   * @param accessToken - 엑세스 토큰
   */
  static addRecommend = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.patch(
        `${POST_RECOMMENDATION_URL}/recommend/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 게시글 추천 삭제 로직
   * @param postId - 추천을 하고자하는 게시글 아이디
   * @param accessToken - 엑세스 토큰
   */
  static deleteRecommend = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.delete(`${POST_RECOMMENDATION_URL}/recommend/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };

  /**
   * 게시글에 대한 유저 활동내역(추천, 북마크) 가져오기
   * @param postId - 활동내역을 가져올 게시글 아이디
   * @param accessToken - 엑세스 토큰
   */
  static getUserActivity = async (postId: string, accessToken: string) => {
    try {
      const res = await axios.get(`${POST_USER_ACTIVITY_URL}/${postId}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return res;
    } catch (err: any) {
      errorHandler(err);
      throw err;
    }
  };
}

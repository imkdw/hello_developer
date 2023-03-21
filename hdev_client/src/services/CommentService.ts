import { api } from "../utils/Common";

export const createComment = async (boardId: string, comment: string, accessToken: string) => {
  try {
    return await api.post(
      "/comments",
      { boardId, comment },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err: any) {
    throw err;
  }
};

export const removeComment = async (commentId: number, accessToken: string) => {
  try {
    return await api.delete(`/comments/${commentId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch (err: any) {
    throw err;
  }
};

export const updateComment = async (commentId: number, updatedComment: string, accessToken: string) => {
  try {
    return await api.patch(
      `/comments/${commentId}`,
      { comment: updatedComment },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err: any) {
    throw err;
  }
};

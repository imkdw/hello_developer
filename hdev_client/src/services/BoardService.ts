import { api } from "../utils/Common";

export const getBoards = async (mainCategory: string, subCategory: string) => {
  try {
    return await api.get(`/boards?category1=${mainCategory}&category2=${subCategory}`);
  } catch (err: any) {
    throw err;
  }
};

interface CreateBoardDto {
  category: string;
  title: string;
  tags: {
    name: string;
  }[];
  content: string;
}

export const createBoard = async (accessToken: string, createBoardDto: CreateBoardDto) => {
  return await api.post(
    "/boards",
    { ...createBoardDto },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const getBoard = async (boardId: string) => {
  try {
    return await api.get(`/boards/${boardId}`);
  } catch (err: any) {
    throw err;
  }
};

interface UpdateBoardDto {
  category: string;
  title: string;
  tags: {
    name: string;
  }[];
  content: string;
}

export const updateBoard = async (boardId: string, updateBoardDto: UpdateBoardDto, accessToken: string) => {
  try {
    return await api.patch(
      `/boards/${boardId}`,
      { ...updateBoardDto },
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

export const removeBoard = async (boardId: string, accessToken: string) => {
  try {
    return await api.delete(`/boards/${boardId}`, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch (err: any) {
    throw err;
  }
};

export const addRecommend = async (boardId: string, accessToken: string) => {
  try {
    return await api.get(`/boards/${boardId}/recommend`, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch (err: any) {
    throw err;
  }
};

export const addViews = async (boardId: string) => {
  try {
    return await api.get(`/boards/${boardId}/views`);
  } catch (err: any) {
    throw err;
  }
};

export const uploadBoardImage = async (boardId: string, formData: FormData, accessToken: string) => {
  try {
    return await api.post(`/boards/${boardId}/image`, formData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err: any) {
    throw err;
  }
};

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
  return await api.get(`/boards/${boardId}`);
};

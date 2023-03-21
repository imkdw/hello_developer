import styled from "styled-components";
import BoardHeader from "./Header/BoardHeader";
import Utils from "./Utils";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { currentBoardState } from "../../../recoil";
import { getBoards } from "../../../services/BoardService";
import ListItem from "./ListItem/ListItem";
import { IBoardItem } from "../../../types/board";

const StyledBoardList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Boards = styled.ul`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 3%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #e8e8e8;
  }
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:active {
    background: #a7a7a7;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }
`;

interface BoardListProps {
  subCategory: string;
}

const BoardList = ({ subCategory }: BoardListProps) => {
  const currentBoard = useRecoilValue(currentBoardState);
  const [boards, setBoards] = useState<IBoardItem[]>([]);

  useEffect(() => {
    const loadBoards = async () => {
      const res = await getBoards(currentBoard, subCategory);
      setBoards(res.data);
    };

    loadBoards();
  }, [currentBoard, subCategory]);

  return (
    <StyledBoardList>
      <BoardHeader />
      <Utils />
      <Boards>
        {boards.map((board) => (
          <ListItem board={board} key={board.boardId} />
        ))}
      </Boards>
    </StyledBoardList>
  );
};

export default BoardList;

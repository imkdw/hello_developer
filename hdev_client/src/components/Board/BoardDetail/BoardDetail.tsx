import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { getBoard } from "../../../services/BoardService";
import { useSetRecoilState } from "recoil";
import { boardDetailState } from "../../../recoil/board";
import BoardHeader from "./BoardHeader";
import BoardContent from "./BoardContent";
import BoardComment from "./BoardComment";

const StyledBoardDetail = styled.div`
  flex: 6;
  height: auto;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

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

const BoardDetail = () => {
  const boardId = useParams().boardId as string;
  const setBoardDetail = useSetRecoilState(boardDetailState);

  useEffect(() => {
    const loadBoard = async () => {
      const res = await getBoard(boardId);
      setBoardDetail(res.data);
    };

    if (boardId) {
      loadBoard();
    }
  }, []);

  return (
    <StyledBoardDetail>
      <BoardHeader />
      <BoardContent />
      <BoardComment />
    </StyledBoardDetail>
  );
};

export default BoardDetail;

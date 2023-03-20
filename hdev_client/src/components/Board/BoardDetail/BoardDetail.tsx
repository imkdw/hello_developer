import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { getBoard } from "../../../services/BoardService";
import { useSetRecoilState } from "recoil";
import { boardDetailState } from "../../../recoil/board";
import BoardHeader from "./Header/BoardHeader";

const StyledBoardDetail = styled.div`
  flex: 6;
  height: 100%;
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
    </StyledBoardDetail>
  );
};

export default BoardDetail;

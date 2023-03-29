import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { addViews, getBoard } from "../../../services/BoardService";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { boardDetailState } from "../../../recoil/board";
import BoardHeader from "./BoardHeader";
import BoardContent from "./BoardContent";
import BoardComment from "./BoardComment";
import { loggedInUserState } from "../../../recoil";
import { useCookies } from "react-cookie";

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
  const loggedInUser = useRecoilValue(loggedInUserState);
  const boardId = useParams().boardId as string;
  const setBoardDetail = useSetRecoilState(boardDetailState);
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    const loadBoard = async () => {
      const res = await getBoard(boardId);
      setBoardDetail(res.data);
    };

    // TODO: 쿠키로 중복조회 불가능하도록 설정
    const addView = async () => {
      const cookieName = `views-${boardId}`;

      if (!cookies[cookieName]) {
        const cookieValue = boardId;
        const cookieExpires = new Date();
        cookieExpires.setTime(cookieExpires.getTime() + 24 * 60 * 60 * 1000);

        setCookie(cookieName, cookieValue, { expires: cookieExpires });

        await addViews(boardId);
      }
    };

    if (boardId) {
      loadBoard();
    }

    if (loggedInUser.accessToken) {
      addView();
    }
    // eslint-disable-next-line
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

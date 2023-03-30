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
      try {
        const res = await getBoard(boardId);
        setBoardDetail(res.data);
      } catch (err: any) {
        let errMessage = "서버 오류입니다. 다시 시도해주세요.";
        if (err.response.status === 404) {
          errMessage = "게시글을 찾을 수 없습니다.";
        }

        alert(errMessage);
      }
    };

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

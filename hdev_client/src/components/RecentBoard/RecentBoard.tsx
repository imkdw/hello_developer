import styled from "styled-components";
import { useEffect, useState } from "react";
import { getRecentBoards } from "../../services/BoardService";
import RecentBoardBox from "./RecentBoardBox";

const StyledRecentBoard = styled.div`
  height: 100%;
  flex: 6;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 767px) {
    align-items: flex-start;
    height: auto;
    overflow-y: scroll;
  }
`;

const Wrapper = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 20px;

  @media screen and (max-width: 767px) {
    gap: 20px;
  }
`;

const BoardWrapper = styled.div`
  width: 40%;
  min-width: 400px;
  height: 48%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SortationTitle = styled.div`
  width: 90%;
  min-height: 50px;
  background-color: #2c65ff;
  border-radius: 20px;
  display: flex;
  align-items: center;
`;

const TitleText = styled.p`
  margin-left: 30px;
  font-size: 24px;
  color: white;
  letter-spacing: 5px;

  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

interface RecentBoardResponse {
  [key: string]: {
    boardId: string;
    title: string;
    createdAt: string;
    user: {
      nickname: string;
      profileImg: string;
    };
    view: {
      viewCnt: number;
    };
  }[];
}

const RecentBoard = () => {
  const [boards, setBoards] = useState<RecentBoardResponse>();

  useEffect(() => {
    const loadRecentBoard = async () => {
      const res = await getRecentBoards();
      setBoards(res.data);
    };

    loadRecentBoard();
  }, []);

  return (
    <StyledRecentBoard>
      {boards && (
        <Wrapper>
          <BoardWrapper>
            <SortationTitle>
              <TitleText>공지사항</TitleText>
            </SortationTitle>
            <RecentBoardBox boardData={boards["notice"]} />
          </BoardWrapper>{" "}
          <BoardWrapper>
            <SortationTitle>
              <TitleText>질문답변</TitleText>
            </SortationTitle>
            <RecentBoardBox boardData={boards["qna"]} />
          </BoardWrapper>{" "}
          <BoardWrapper>
            <SortationTitle>
              <TitleText>지식공유</TitleText>
            </SortationTitle>
            <RecentBoardBox boardData={boards["knowledge"]} />
          </BoardWrapper>{" "}
          <BoardWrapper>
            <SortationTitle>
              <TitleText>인원모집</TitleText>
            </SortationTitle>
            <RecentBoardBox boardData={boards["recruitment"]} />
          </BoardWrapper>
        </Wrapper>
      )}
    </StyledRecentBoard>
  );
};
export default RecentBoard;

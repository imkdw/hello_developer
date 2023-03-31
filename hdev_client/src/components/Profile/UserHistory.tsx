import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { categoryDataState } from "../../recoil/board";
import { getHistory } from "../../services/UserService";
import { UserBoardHistory, UserCommentHistory } from "../../types/user";
import { dateFormater } from "../../utils/Common";

const StyledUserHistory = styled.div`
  width: 48%;
  height: 90%;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 767px) {
    width: 90%;
    height: 650px;
    margin-bottom: 20px;
  }
`;

const HistoryTab = styled.div`
  width: 95%;
  min-height: 80px;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 767px) {
    min-height: 60px;
  }
`;

const TabItem = styled.div<{ $isBorder: boolean }>`
  font-size: 20px;
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: ${(props) => (props.$isBorder ? "2px solid #0090f9" : "")};

  &:hover {
    border-bottom: 2px solid #0090f9;
  }

  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;

const History = styled.ul`
  width: 95%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

  @media screen and (max-width: 767px) {
    height: 90%;
  }
`;

const HistoryItem = styled(Link)`
  width: 100%;
  min-height: 100px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;
  padding: 0 10px;

  &:first-child {
    margin-top: 10px;
  }

  &:hover {
    background-color: #e7e9eb;
  }
`;

const HistoryCategory = styled.div`
  font-size: 18px;
  width: 100%;
`;

const CategoryText = styled.span`
  font-size: 20px;
  color: #0090f9;

  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`;

const HistoryData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BoardTitle = styled.div`
  font-size: 20px;
`;

const BoardCreatedAt = styled.div`
  font-size: 18px;
  color: #7d7d7d;

  @media screen and (max-width: 767px) {
    font-size: 15px;
  }
`;

const NoData = styled.p`
  font-size: 20px;
  color: gray;
  align-self: center;
  margin-top: 50px;
`;

interface UserHistoryProps {
  userId: string;
}

const UserHistory = ({ userId }: UserHistoryProps) => {
  const [boards, setBoards] = useState<UserBoardHistory[] | []>([]);
  const [commentsBoards, setCommentsBoard] = useState<UserCommentHistory[] | []>([]);

  const categoryData = useRecoilValue(categoryDataState);

  const [enableTab, setEnableTag] = useState({
    board: true,
    comment: false,
  });

  const historyHandler = useCallback(
    async (item: "board" | "comment") => {
      try {
        const res = await getHistory(userId, item);

        if (item === "board") {
          setBoards(res.data);
        } else if (item === "comment") {
          setCommentsBoard(res.data);
        }
      } catch (err: any) {
        alert("에러발생");
        console.error(err);
      }
    },
    [userId]
  );

  useEffect(() => {
    const getBoard = async () => {
      await historyHandler("board");
    };

    if (userId) {
      getBoard();
    }
  }, [userId, historyHandler]);

  const enableTabHandler = (item: "board" | "comment" | "bookmark") => {
    switch (item) {
      case "board":
        setEnableTag((prevState) => {
          return { ...prevState, board: true, comment: false };
        });
        break;

      case "comment":
        setEnableTag((prevState) => {
          return { ...prevState, comment: true, board: false };
        });
        break;
    }
  };

  return (
    <StyledUserHistory>
      <HistoryTab>
        <TabItem
          onClick={async () => {
            await historyHandler("board");
            enableTabHandler("board");
          }}
          $isBorder={enableTab.board}
        >
          작성한 글
        </TabItem>
        <TabItem
          onClick={async () => {
            await historyHandler("comment");
            enableTabHandler("comment");
          }}
          $isBorder={enableTab.comment}
        >
          작성한 댓글
        </TabItem>
      </HistoryTab>
      <History>
        {boards.length === 0 && <NoData>데이터가 없습니다.</NoData>}
        {boards.length > 0 &&
          (enableTab.board
            ? boards.map((board) => (
                <HistoryItem key={board.boardId} to={"/boards/" + board.boardId}>
                  <HistoryCategory>
                    카테고리 :{" "}
                    <CategoryText>
                      {board.category2
                        ? `${categoryData[board.category1.name]}-${categoryData[board.category2.name]}`
                        : `${categoryData[board.category1.name]}`}
                    </CategoryText>
                  </HistoryCategory>
                  <HistoryData>
                    <BoardTitle>{board.title}</BoardTitle>
                    <BoardCreatedAt>{dateFormater(board.createdAt)}</BoardCreatedAt>
                  </HistoryData>
                </HistoryItem>
              ))
            : commentsBoards.map((commentBoard) => (
                <HistoryItem key={commentBoard.board.boardId} to={"/boards/" + commentBoard.board.boardId}>
                  <HistoryCategory>
                    카테고리 :{" "}
                    <CategoryText>
                      {commentBoard.board.category2
                        ? `${categoryData[commentBoard.board.category1.name]}-${
                            categoryData[commentBoard.board.category2.name]
                          }`
                        : `${categoryData[commentBoard.board.category1.name]}`}
                    </CategoryText>
                  </HistoryCategory>
                  <HistoryData>
                    <BoardTitle>{commentBoard.board.title}</BoardTitle>
                    <BoardCreatedAt>{dateFormater(commentBoard.board.createdAt)}</BoardCreatedAt>
                  </HistoryData>
                </HistoryItem>
              )))}
      </History>
    </StyledUserHistory>
  );
};

export default UserHistory;

import styled from "styled-components";
import RecentItem from "./RecentItem";

const StyledRecentBoardBox = styled.div`
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

interface RecentBoardBoxProps {
  boardData: {
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

const RecentBoardBox = ({ boardData }: RecentBoardBoxProps) => {
  return (
    <StyledRecentBoardBox>
      {boardData.map((data) => (
        <RecentItem data={data} key={data.boardId} />
      ))}
    </StyledRecentBoardBox>
  );
};
export default RecentBoardBox;

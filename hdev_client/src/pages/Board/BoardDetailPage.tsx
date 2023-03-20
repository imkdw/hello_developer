import styled from "styled-components";
import { BoardDetail } from "../../components/Board/BoardDetail";
import { Menu } from "../../components/Menu";

const StyledBoardDetailPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const BoardDetailPage = () => {
  return (
    <StyledBoardDetailPage>
      <Menu />
      <BoardDetail />
    </StyledBoardDetailPage>
  );
};

export default BoardDetailPage;

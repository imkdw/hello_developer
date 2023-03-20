import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentBoardState } from "../../recoil";
import BoardList from "../../components/Board/BoardList/BoardList";
import { useLocation } from "react-router-dom";

const StyledBoardListPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  flex: 6;
  height: 100%;
`;

interface BoardListPageProps {
  currentBoard: string;
}

const BoardListPage = ({ currentBoard }: BoardListPageProps) => {
  const [_currentBoard, setCurrentBoard] = useRecoilState(currentBoardState);
  const pathnameArr = useLocation().pathname.split("/");

  const subCategory = pathnameArr.length === 3 ? pathnameArr[2] : "";

  useEffect(() => {
    if (currentBoard) setCurrentBoard(currentBoard);
  }, [currentBoard]);

  return (
    <StyledBoardListPage>
      <Menu />
      <Wrapper>{_currentBoard && <BoardList subCategory={subCategory} />}</Wrapper>
    </StyledBoardListPage>
  );
};

export default BoardListPage;

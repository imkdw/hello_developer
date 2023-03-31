import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentBoardState, enableMenuState } from "../../recoil";
import BoardList from "../../components/Board/BoardList/BoardList";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { MobileHeader } from "../../components/Mobile";

const StyledBoardListPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

interface BoardListPageProps {
  currentBoard: string;
}

const BoardListPage = ({ currentBoard }: BoardListPageProps) => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const [enableMenu, setEnableMenu] = useRecoilState(enableMenuState);
  const [_currentBoard, setCurrentBoard] = useRecoilState(currentBoardState);
  const pathnameArr = useLocation().pathname.split("/");

  const subCategory = pathnameArr.length === 3 ? pathnameArr[2] : "";

  useEffect(() => {
    if (currentBoard) setCurrentBoard(currentBoard);
    setEnableMenu(false);
  }, [currentBoard, setCurrentBoard, setEnableMenu]);

  return (
    <StyledBoardListPage>
      {!isMobile && <Menu />}
      {isMobile && <MobileHeader />}
      {enableMenu && <Menu />}
      {_currentBoard && <BoardList subCategory={subCategory} />}
    </StyledBoardListPage>
  );
};

export default BoardListPage;

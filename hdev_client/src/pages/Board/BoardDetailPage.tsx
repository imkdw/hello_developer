import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { BoardDetail } from "../../components/Board/BoardDetail";
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/Mobile";
import { enableMenuState } from "../../recoil";

const StyledBoardDetailPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const BoardDetailPage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const [enableMenu, setEnableMenu] = useRecoilState(enableMenuState);

  useEffect(() => {
    setEnableMenu(false);
  }, [setEnableMenu]);

  return (
    <StyledBoardDetailPage>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableMenu && <Menu />}
      <BoardDetail />
    </StyledBoardDetailPage>
  );
};

export default BoardDetailPage;

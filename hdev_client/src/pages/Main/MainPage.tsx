import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { enableMenuState } from "../../recoil";
import MobileHeader from "../../components/Mobile/Header/MobileHeader";
import RecentBoard from "../../components/RecentBoard/RecentBoard";

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const MainPage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableMenuState);

  return (
    <StyledMain>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableSideMenu && <Menu />}
      <RecentBoard />
    </StyledMain>
  );
};

export default MainPage;

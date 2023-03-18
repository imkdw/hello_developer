import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { RecentBoard } from "../../components/RecentBoard";
import { useMediaQuery } from "react-responsive";

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    height: auto;
    flex-direction: column;
    gap: 20px;
  }
`;

const MainPage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  // const enableSideMenu = useRecoilValue(enableSideMenuState);

  return (
    <StyledMain>
      <Menu />
      {/* {isMobile && <MobileHeader />} */}

      {/* 모바일 환경에서는 사이드메뉴 렌더링 X */}
      {/* {!isMobile && <SideMenu />} */}
      {/* 모바일 헤더 메뉴버튼 클릭시 사이드메뉴 비활성화 / 활성화 */}
      {/* {enableSideMenu && <SideMenu />} */}
      <RecentBoard />
    </StyledMain>
  );
};

export default MainPage;

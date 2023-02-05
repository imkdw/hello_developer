import styled from "styled-components";
import { RecentPost } from "./RecentPost";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";

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

const Main = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  return (
    <StyledMain>
      {isMobile && <MobileHeader />}

      {/* 모바일 환경에서는 사이드메뉴 렌더링 X */}
      {!isMobile && <SideMenu />}
      {/* 모바일 헤더 메뉴버튼 클릭시 사이드메뉴 비활성화 / 활성화 */}
      {enableSideMenu && <SideMenu />}
      <RecentPost />
    </StyledMain>
  );
};

export default Main;

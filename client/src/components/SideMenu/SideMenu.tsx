import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
import SideMenuLink from "./SideMenuLink";
import SideMenuLogo from "./SideMenuLogo";
import SideMenuSearch from "./SideMenuSearch";
import React from "react";

import { useSetRecoilState } from "recoil";
import { enableSideMenuState } from "../../recoil/ui.recoil";

const StyledSideMenu = styled.div`
  height: 100%;
  background-color: #f8f8f9;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e6e8;
  flex: 1.5;

  @media screen and (max-width: 767px) {
    width: 100%;
    height: 100%;
    position: absolute;
    max-width: initial;
    z-index: 1;
  }
`;

const CloseButton = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7L25 25" stroke="#767E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 25L25 7" stroke="#767E8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const SideMenu = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });

  const setEnableSideMenu = useSetRecoilState(enableSideMenuState);

  /** 모바일환경 사이드메뉴 비활성화 */
  const sideMenuHandler = () => {
    setEnableSideMenu((prevState) => !prevState);
    document.body.style.overflow = "scroll";
  };

  return (
    <StyledSideMenu>
      {/* 모바일 환경에서 사이드메뉴 닫기버튼 렌더링 */}
      {isMobile && (
        <CloseButton onClick={sideMenuHandler}>
          <CloseIcon />
        </CloseButton>
      )}
      <SideMenuLogo />
      <SideMenuSearch />

      {/* 모바일환경 사이드메뉴에 링크 클릭시 사이드메뉴 비활성화 필요 */}
      {isMobile ? <SideMenuLink onClick={sideMenuHandler} /> : <SideMenuLink />}
    </StyledSideMenu>
  );
};

export default React.memo(SideMenu);

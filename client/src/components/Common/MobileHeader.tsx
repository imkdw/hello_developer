import styled from "styled-components";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import Logo from "./Logo";
import { useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";

const StyledMobileHeader = styled(Link)`
  width: 100%;
  min-height: 80px;
  display: flex;
  position: relative;
  border-bottom: 1px solid #e5e6e8;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MenuIcon = () => {
  return (
    <svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H30V4.19922H0V0ZM0 14.5508V10.4492H30V14.5508H0ZM0 25V20.8008H30V25H0Z" fill="#005DFF" />
    </svg>
  );
};

const MobileHeader = () => {
  const setEnableSideMenu = useSetRecoilState(enableSideMenuState);

  /** 모바일환경 사이드메뉴 활성화 */
  const sideMenuHandler = () => {
    setEnableSideMenu((prevState) => !prevState);
    document.body.style.overflow = "hidden";
  };

  return (
    <StyledMobileHeader to="/">
      <IconWrapper onClick={sideMenuHandler}>
        <MenuIcon />
      </IconWrapper>
      <Logo width={150} height={50} />
    </StyledMobileHeader>
  );
};

export default MobileHeader;

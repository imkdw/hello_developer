import { useMediaQuery } from "react-responsive";
import styled from "styled-components";
// import MenuLink from "./MenuLink";
// import MenuLogo from "./MenuLogo";
// import MenuSearch from "./MenuSearch";

import { useSetRecoilState } from "recoil";
import { CloseIcon } from "../../assets/icon";
import { enableMenuState } from "../../recoil";
import MenuLogo from "./MenuLogo";
import MenuSearch from "./MenuSearch";
import MenuLink from "./MenuLink";

const StyledMenu = styled.div`
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

const Menu = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });

  const setEnableMenu = useSetRecoilState(enableMenuState);

  /** 모바일환경 사이드메뉴 비활성화 */
  const closeMenuHandler = () => {
    setEnableMenu((prevState) => !prevState);
    document.body.style.overflow = "scroll";
  };

  return (
    <StyledMenu>
      {isMobile && (
        <CloseButton onClick={closeMenuHandler}>
          <CloseIcon />
        </CloseButton>
      )}
      <MenuLogo />
      <MenuSearch />
      <MenuLink />
      {/* 모바일환경 사이드메뉴에 링크 클릭시 사이드메뉴 비활성화 필요 */}
      {/* {isMobile ? <MenuLink onClick={closeMenuHandler} /> : <MenuLink />} */}
    </StyledMenu>
  );
};

export default Menu;

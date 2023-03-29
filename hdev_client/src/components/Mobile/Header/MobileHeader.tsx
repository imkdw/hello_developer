import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { HeaderMenuIcon } from "../../../assets/icon";
import { enableMenuState } from "../../../recoil";
import { Logo } from "../../Common";

const StyledMobileHeader = styled.div`
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

const MobileHeader = () => {
  const setEnableMenu = useSetRecoilState(enableMenuState);

  /** 모바일환경 사이드메뉴 활성화 */
  const sideMenuHandler = () => {
    setEnableMenu((prevState) => !prevState);
    document.body.style.overflow = "hidden";
  };

  return (
    <StyledMobileHeader>
      <IconWrapper onClick={sideMenuHandler}>
        <HeaderMenuIcon />
      </IconWrapper>
      <Logo width={150} height={50} />
    </StyledMobileHeader>
  );
};

export default MobileHeader;

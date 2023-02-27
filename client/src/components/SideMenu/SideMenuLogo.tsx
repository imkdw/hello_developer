import { Link } from "react-router-dom";
import styled from "styled-components";
import Logo from "../Common/Logo";

const StyledSideMenuLogo = styled.div`
  width: 100%;
  height: 15%;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e6e8;
`;

const SideMenuLogo = () => {
  return (
    <StyledSideMenuLogo>
      <Logo width={200} height={70} />
    </StyledSideMenuLogo>
  );
};

export default SideMenuLogo;

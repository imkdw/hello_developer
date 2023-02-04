import styled from "styled-components";
import SideMenuLink from "./SideMenuLink";
import SideMenuLogo from "./SideMenuLogo";
import SideMenuSearch from "./SideMenuSearch";

const StyledSideMenu = styled.div`
  width: 18%;
  min-width: 350px;
  max-width: 350px;
  height: 100%;
  background-color: #f8f8f9;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e6e8;
  flex: 1;

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const SideMenu = () => {
  return (
    <StyledSideMenu>
      <SideMenuLogo />
      <SideMenuSearch />
      <SideMenuLink />
    </StyledSideMenu>
  );
};

export default SideMenu;

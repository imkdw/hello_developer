import styled from "styled-components";
import { SideMenu } from "../../SideMenu";
import { RecentPost } from "./RecentPost";
import { useMediaQuery } from "react-responsive";
import { MobileHeader } from "../../Common";

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

  return (
    <StyledMain>
      {isMobile && <MobileHeader />}
      {!isMobile && <SideMenu />}
      <RecentPost />
    </StyledMain>
  );
};

export default Main;

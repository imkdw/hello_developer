import styled from "styled-components";
import { SideMenu } from "../../SideMenu";
import { RecentPost } from "./RecentPost";

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Main = () => {
  return (
    <StyledMain>
      <SideMenu />
      <RecentPost />
    </StyledMain>
  );
};

export default Main;

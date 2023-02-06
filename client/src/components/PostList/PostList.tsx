import styled from "styled-components";
import List from "./List";
import Header from "./Header";
import Utils from "./Utils";
import { currentPageState, enableSideMenuState } from "../../recoil/ui.recoil";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useMediaQuery } from "react-responsive";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import { useEffect } from "react";

const StyledPostList = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  flex: 6;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface PostListProps {
  currentPage: string;
}

const PostList = ({ currentPage }: PostListProps) => {
  const setCurrentPage = useSetRecoilState(currentPageState);
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage, setCurrentPage]);

  return (
    <StyledPostList>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <Wrapper>
        <Header />
        <Utils />
        <List />
      </Wrapper>
    </StyledPostList>
  );
};

export default PostList;

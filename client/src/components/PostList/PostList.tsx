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
import { useLocation } from "react-router-dom";

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
  const enableSideMenu = useRecoilValue(enableSideMenuState);
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const pathname = useLocation().pathname;

  useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage, setCurrentPage]);

  /** currentPage Props가 전달이 안된경우 path 기준으로 갱신 */
  if (!currentPage) {
    setCurrentPage(pathname.replace("/", ""));
  }

  /** 게시글 카테고리 지정 */
  const category1 = currentPage;
  let category2 = "";

  if (pathname.split("/").length === 3) {
    const pathnameArr = pathname.split("/");
    category2 = pathnameArr[pathnameArr.length - 1];
  }

  return (
    <StyledPostList>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <Wrapper>
        <Header />
        <Utils />
        <List category1={category1} category2={category2} />
      </Wrapper>
    </StyledPostList>
  );
};

export default PostList;

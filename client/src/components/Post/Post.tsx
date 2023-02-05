import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPageState, enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import PostData from "./PostData";

const StyledPost = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

interface PostProps {
  currentPage: string;
}

const Post = ({ currentPage }: PostProps) => {
  const setCurrentPage = useSetRecoilState(currentPageState);
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  useEffect(() => {
    setCurrentPage(currentPage);
  }, [currentPage]);

  return (
    <StyledPost>
      {isMobile && <MobileHeader />}

      {/* 모바일 환경에서는 사이드메뉴 렌더링 X */}
      {!isMobile && <SideMenu />}
      {/* 모바일 헤더 메뉴버튼 클릭시 사이드메뉴 비활성화 / 활성화 */}
      {enableSideMenu && <SideMenu />}
      <PostData />
    </StyledPost>
  );
};

export default Post;

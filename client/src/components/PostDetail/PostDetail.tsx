import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPageState, enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import Detail from "./Detail";

const StyledPostDetail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const PostDetail = () => {
  const params = useParams();
  const setCurrentPage = useSetRecoilState(currentPageState);
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  console.log(params);

  return (
    <StyledPostDetail>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <Detail />
    </StyledPostDetail>
  );
};

export default PostDetail;

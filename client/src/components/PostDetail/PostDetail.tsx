import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import Detail from "./Detail";
import { useEffect } from "react";
import { PostService } from "../../services/post";

const StyledPostDetail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const PostDetail = () => {
  const postId = useParams().postId;
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  const setPostDetailData = useSetRecoilState(postDetailDataState);
  const setCurrentPostId = useSetRecoilState(currentPostIdState);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const { status, post } = await PostService.detail(postId);
        if (status === 200 || status === 304) {
          setPostDetailData(post);
        }
      } catch (err: any) {
        alert("서버 오류 발생");
      }
    };

    if (postId) {
      setCurrentPostId(postId);
      getDetail();
    }
  }, [postId]);

  return (
    <StyledPostDetail>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <Detail />
    </StyledPostDetail>
  );
};

export default PostDetail;

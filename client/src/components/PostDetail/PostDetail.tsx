import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState, postOfUserActivityState } from "../../recoil/post.recoil";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import Detail from "./Detail";
import { useEffect } from "react";
import { PostService } from "../../services/post";
import { loggedInUserState } from "../../recoil/auth.recoil";

const StyledPostDetail = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const PostDetail = () => {
  const postId = useParams().postId || "";
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  const setPostDetailData = useSetRecoilState(postDetailDataState);
  const setCurrentPostId = useSetRecoilState(currentPostIdState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const setPostOfUserActivity = useSetRecoilState(postOfUserActivityState);

  useEffect(() => {
    /** 게시글 데이터 가져오기 */
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

    /** 게시글 조회수 추가하기 */
    const addViewCount = async () => {
      try {
        await PostService.addViewCount(postId, loggedInUser.accessToken);
      } catch (err: any) {}
    };

    /** 게시글에 대한 유저의 활동내역(북마크, 추천) 가져오기 */
    const getUserActivity = async () => {
      try {
        const res = await PostService.getUserActivity(postId, loggedInUser.accessToken);
        console.log(res.data);

        setPostOfUserActivity((prevState) => {
          return { ...prevState, isRecommend: res.data.isRecommend, isBookmark: res.data.isBookmark };
        });
      } catch (err: any) {
        alert("에러발생");
      }
    };

    if (postId) {
      setCurrentPostId(postId);

      // 로그인을 한 경우
      if (postId && loggedInUser.accessToken) {
        // TODO: 쿠키를 설정해서 조회수 중복추가 방지로직 구현필요
        addViewCount();
        getUserActivity();
      }
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

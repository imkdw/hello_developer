import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { postDetailDataState, postOfUserActivityState } from "../../recoil/post.recoil";
import { PostService } from "../../services/post";

const StyledData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Tags = styled.div`
  display: flex;
  gap: 10px;
`;

const TagText = styled.p`
  width: auto;
  padding: 0 15px 0 15px;
  background-color: #f3f4f6;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  @media screen and (max-width: 767px) {
    font-size: 12px;
    padding: 0 10px 0 10px;
  }
`;

const RecommendCount = styled.button<{ backgroundColor?: string }>`
  width: auto;
  padding: 5px 15px 5px 15px;
  display: flex;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  background-color: ${(props) => props.backgroundColor};

  @media screen and (max-width: 767px) {
    padding: 5px 10px 5px 10px;
  }

  &:hover {
    background-color: #dfdfdf;
  }
`;

const RecommendIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.01953 14.124V26.3899C1.01953 26.8735 1.41094 27.266 1.89352 27.266H9.75756V13.2477H1.89352C1.41094 13.2477 1.01953 13.6403 1.01953 14.124Z"
        fill="#1872D9"
      />
      <path
        d="M25.4854 11.4954H18.4951V6.23842C18.4951 4.30559 16.9276 2.7341 15.0002 2.7341H12.3785C11.8964 2.7341 11.5051 3.1265 11.5051 3.60996V7.75781L8.12514 13.6894C8.0482 13.8223 8.00977 13.9714 8.00977 14.124V26.3899C8.00977 26.8734 8.40117 27.266 8.8834 27.266H22.9077C24.2885 27.266 25.5432 26.4478 26.1006 25.1844L28.9036 18.8602C28.9544 18.7483 28.9807 18.6271 28.9807 18.5047V15C28.9808 13.067 27.413 11.4954 25.4854 11.4954Z"
        fill="#BCDFFD"
      />
    </svg>
  );
};

const Data = () => {
  const [postDetailData, setPostDetailData] = useRecoilState(postDetailDataState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [postOfUserActivity, setPostOfUserActivity] = useRecoilState(postOfUserActivityState);

  const recommendationHandler = async () => {
    console.log(postOfUserActivity);
    try {
      if (postOfUserActivity.isRecommend) {
        // 기존에 추천이 되있는 게시글이면 추천 삭제
        const res = await PostService.deleteRecommend(postDetailData.postId, loggedInUser.accessToken);

        setPostOfUserActivity((prevState) => {
          return { ...prevState, isRecommend: false };
        });

        setPostDetailData((prevState) => {
          return { ...prevState, recommendCnt: prevState.recommendCnt - 1 };
        });
        alert("추천이 취소되었습니다.");
      } else {
        // 기존에 추천이 되어있지 않은 게시글이면 추천 추가
        const res = await PostService.addRecommend(postDetailData.postId, loggedInUser.accessToken);

        setPostOfUserActivity((prevState) => {
          return { ...prevState, isRecommend: true };
        });

        setPostDetailData((prevState) => {
          return { ...prevState, recommendCnt: prevState.recommendCnt + 1 };
        });

        alert("추천이 완료되었습니다.");
      }
    } catch (err: any) {
      alert("에러 발생");
      console.error(err);
    }
  };

  return (
    <StyledData>
      <Tags>
        {postDetailData.tags.map((tag) => {
          if (tag.name.length !== 0) {
            return <TagText key={tag.name}># {tag.name}</TagText>;
          }

          return null;
        })}
      </Tags>
      {postOfUserActivity.isRecommend ? (
        <RecommendCount onClick={recommendationHandler} backgroundColor="#dfdfdf">
          <RecommendIcon />
          {postDetailData.recommendCnt}
        </RecommendCount>
      ) : (
        <RecommendCount onClick={recommendationHandler}>
          <RecommendIcon />
          {postDetailData.recommendCnt}
        </RecommendCount>
      )}
    </StyledData>
  );
};

export default Data;

import styled from "styled-components";
import Posts from "./RecentPosts";

const StyledRecentPost = styled.div`
  height: 100%;
  flex: 6;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 90%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;

  @media screen and (max-width: 767px) {
    width: 100%;
    flex-direction: column;
    gap: 20px;
  }
`;

const PostWrapper = styled.div`
  width: 40%;
  min-width: 400px;
  height: 48%;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media screen and (max-width: 767px) {
    width: 100%;
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const SortationTitle = styled.div`
  width: 90%;
  height: 50px;
  background-color: #2c65ff;
  border-radius: 20px;
  display: flex;
  align-items: center;

  @media screen and (max-width: 767px) {
    height: 45px;
  }
`;

const TitleText = styled.p`
  margin-left: 30px;
  font-size: 24px;
  color: white;
  letter-spacing: 5px;

  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const RecentPost = () => {
  return (
    <StyledRecentPost>
      <Wrapper>
        <PostWrapper>
          <SortationTitle>
            <TitleText>공지사항</TitleText>
          </SortationTitle>
          <Posts />
        </PostWrapper>{" "}
        <PostWrapper>
          <SortationTitle>
            <TitleText>질문답변</TitleText>
          </SortationTitle>
          <Posts />
        </PostWrapper>{" "}
        <PostWrapper>
          <SortationTitle>
            <TitleText>지식공유</TitleText>
          </SortationTitle>
          <Posts />
        </PostWrapper>{" "}
        <PostWrapper>
          <SortationTitle>
            <TitleText>인원모집</TitleText>
          </SortationTitle>
          <Posts />
        </PostWrapper>
      </Wrapper>
    </StyledRecentPost>
  );
};
export default RecentPost;

import styled from "styled-components";
import Posts from "./Posts";

const StyledRecentPost = styled.div`
  height: 100%;
  flex: 4;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PostWrapper = styled.div`
  width: 38%;
  height: 48%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const SortationTitle = styled.div`
  width: 90%;
  height: 50px;
  background-color: #2c65ff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  flex: 1;
`;

const TitleText = styled.p`
  margin-left: 30px;
  font-size: 24px;
  color: white;
  letter-spacing: 5px;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
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

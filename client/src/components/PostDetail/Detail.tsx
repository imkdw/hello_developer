import styled from "styled-components";
import CommentCount from "./CommentCount";
import Comments from "./Comments";
import Content from "./Content";
import Data from "./Data";
import Header from "./Header";
import Title from "./Title";
import WriteComment from "./WriteComment";

const StyledDetail = styled.div`
  flex: 6;
  height: auto;
  display: flex;
  justify-content: center;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Wrapper = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Detail = () => {
  return (
    <StyledDetail>
      <Wrapper>
        <Header />
        <Title />
        <Content />
        <Data />
        <CommentCount />
        <WriteComment />
        <Comments />
      </Wrapper>
    </StyledDetail>
  );
};

export default Detail;

import styled from "styled-components";
import CommentCount from "./CommentCount";
import Content from "./Content";
import Data from "./Data";
import Header from "./Header";
import Title from "./Title";
import WriteComment from "./WriteComment";

const StyledDetail = styled.div`
  flex: 6;
  height: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 90%;
  height: 100%;
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
      </Wrapper>
    </StyledDetail>
  );
};

export default Detail;

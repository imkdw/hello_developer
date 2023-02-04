import styled from "styled-components";
import PostItem from "./PostItem";

const StyledPosts = styled.div`
  width: 80%;
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const Posts = () => {
  return (
    <StyledPosts>
      <PostItem />
      <PostItem />
      <PostItem />
      <PostItem />
    </StyledPosts>
  );
};

export default Posts;

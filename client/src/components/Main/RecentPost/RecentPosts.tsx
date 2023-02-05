import styled from "styled-components";
import PostItem from "./RecentPostItem";

const StyledPosts = styled.div`
  width: 85%;
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  @media screen and (max-width: 767px) {
    gap: 10px;
  }
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

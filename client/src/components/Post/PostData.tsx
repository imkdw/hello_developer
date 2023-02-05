import styled from "styled-components";
import PostDataHeader from "./PostDataHeader";

const StyledPostData = styled.div`
  flex: 4;
`;

const PostData = () => {
  return (
    <StyledPostData>
      <PostDataHeader />
    </StyledPostData>
  );
};

export default PostData;

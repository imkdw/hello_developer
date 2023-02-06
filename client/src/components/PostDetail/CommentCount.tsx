import styled from "styled-components";

const StyledCommentCount = styled.div`
  width: 100%;
  border-top: 1px solid;
  padding: 20px 0 20px 0;
`;

const CommentCount = () => {
  return <StyledCommentCount>16개의 댓글이 있습니다.</StyledCommentCount>;
};

export default CommentCount;

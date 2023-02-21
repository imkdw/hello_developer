import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { postDetailDataState } from "../../recoil/post.recoil";

const StyledCommentCount = styled.div`
  width: 100%;
  border-top: 1px solid;
  padding: 20px 0 20px 0;
`;

const CommentCount = () => {
  const postDetailData = useRecoilValue(postDetailDataState);

  return <StyledCommentCount>{postDetailData.comments.length}개의 댓글이 있습니다.</StyledCommentCount>;
};

export default CommentCount;

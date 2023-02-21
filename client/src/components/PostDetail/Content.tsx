import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { postDetailDataState } from "../../recoil/post.recoil";

const StyledContent = styled.div`
  width: 100%;
  height: auto;
  font-size: 18px;
`;

const Content = () => {
  const postDetailData = useRecoilValue(postDetailDataState);

  return <StyledContent>{postDetailData.content}</StyledContent>;
};

export default Content;

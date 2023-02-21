import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { postDetailDataState } from "../../recoil/post.recoil";

const StyledTitle = styled.h1`
  width: 100%;
`;

const Title = () => {
  const postDetailData = useRecoilValue(postDetailDataState);

  return <StyledTitle>{postDetailData.title}</StyledTitle>;
};

export default Title;

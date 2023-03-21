import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { RecommendIcon } from "../../../assets/icon";
import { boardDetailState } from "../../../recoil/board";

const StyledBoardContent = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 40px;
`;

const Content = styled.div`
  width: 100%;
  height: auto;
  font-size: 18px;
`;

const TagsAndRecommend = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Tags = styled.div`
  height: 40px;
  display: flex;
  gap: 10px;
`;

const TagText = styled.p`
  width: auto;
  height: 100%;
  background-color: #f3f4f6;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 10px;
`;

const Recommend = styled.button<{ backgroundColor?: string }>`
  width: auto;
  padding: 5px 15px 5px 15px;
  display: flex;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  background-color: ${(props) => props.backgroundColor};

  @media screen and (max-width: 767px) {
    padding: 5px 10px 5px 10px;
  }

  &:hover {
    background-color: #dfdfdf;
  }
`;

const BoardContent = () => {
  const boardDetail = useRecoilValue(boardDetailState);

  const recommendHandler = () => {};

  return (
    <StyledBoardContent>
      <Title>{boardDetail.title}</Title>
      <Content>{boardDetail.content}</Content>
      <TagsAndRecommend>
        <Tags>
          {boardDetail.tags.map((tag) => {
            if (tag.name.length !== 0) {
              return <TagText key={tag.name}># {tag.name}</TagText>;
            }
          })}
        </Tags>
        {1 ? (
          <Recommend onClick={recommendHandler} backgroundColor="#f0f0f0">
            <RecommendIcon />
            {boardDetail.recommendCnt}
          </Recommend>
        ) : (
          <Recommend onClick={recommendHandler}>
            <RecommendIcon />
            {boardDetail.recommendCnt}
          </Recommend>
        )}
      </TagsAndRecommend>
    </StyledBoardContent>
  );
};
export default BoardContent;

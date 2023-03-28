import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardDataState, currentBoardState } from "../../../../recoil/board";

const StyledSubject = styled.div`
  width: 95%;
  height: 70px;
  display: flex;
  align-items: flex-end;
  gap: 10px;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }
`;

const MainText = styled.h1`
  font-size: 30px;
`;

const DescText = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Subject = () => {
  const boardData = useRecoilValue(boardDataState);
  const currentBoard = useRecoilValue(currentBoardState);

  return (
    <StyledSubject>
      <MainText>{boardData[currentBoard].title}</MainText>
      <DescText>{boardData[currentBoard].desc}</DescText>
    </StyledSubject>
  );
};
export default Subject;

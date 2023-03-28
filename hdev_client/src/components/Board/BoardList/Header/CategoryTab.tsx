import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardDataState, currentBoardState } from "../../../../recoil/board";

const StyledCategoryTab = styled.div`
  width: 95%;
  height: 50px;
  display: flex;
  gap: 10px;

  @media screen and (max-width: 767px) {
    justify-content: center;
  }
`;

const CategoryItem = styled(Link)<{ $isBorderBottom: boolean }>`
  width: 8%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${(props) => props.$isBorderBottom && "2px solid #0064fe"};

  &:hover {
    border-bottom: 2px solid #0064fe;
  }

  @media screen and (max-width: 767px) {
    width: 20%;
  }
`;

const CategoryTab = () => {
  const boardData = useRecoilValue(boardDataState);
  const currentBoard = useRecoilValue(currentBoardState);
  const currentPathname = useLocation().pathname;

  return (
    <StyledCategoryTab>
      {boardData[currentBoard].category?.map((category) => {
        const linkTo = boardData[currentBoard].link + category.link;
        const isBorderBottom = currentPathname === linkTo;

        return (
          <CategoryItem to={linkTo} $isBorderBottom={isBorderBottom} key={category.link}>
            {category.text}
          </CategoryItem>
        );
      })}
    </StyledCategoryTab>
  );
};

export default CategoryTab;

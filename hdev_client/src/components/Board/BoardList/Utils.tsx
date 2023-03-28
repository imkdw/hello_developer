import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardDataState, currentBoardState, searchKeywordState } from "../../../recoil/board";
import { ChangeEvent } from "react";
import { SearchIcon } from "../../../assets/icon";

const StyledUtils = styled.div`
  width: 100%;
  min-height: 70px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  align-items: center;

  @media screen and (max-width: 767px) {
    width: 100%;
    min-height: 60px;
    align-items: center;
    justify-content: center;
  }
`;

const Search = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media screen and (max-width: 767px) {
    width: 90%;
    gap: 5px;
  }
`;

const Input = styled.input`
  width: 90%;
  height: 50%;
  font-size: 15px;
`;

const MobileAddPostButton = styled(Link)`
  width: 80px;
  height: 40px;
  border-radius: 10px;
  background-color: #0064fe;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  font-size: 16px;
`;

const Utils = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const boardData = useRecoilValue(boardDataState);
  const currentBoard = useRecoilValue(currentBoardState);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);

  const keywordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.currentTarget.value);
  };

  return (
    <StyledUtils>
      {isMobile ? (
        <Search>
          <SearchIcon />
          <Input
            placeholder={boardData[currentBoard].title + "에서 검색해보세요!"}
            onChange={keywordChangeHandler}
            value={searchKeyword}
          />
          <MobileAddPostButton to="/boards/add">글작성</MobileAddPostButton>
        </Search>
      ) : (
        <Search>
          <SearchIcon />
          <Input
            placeholder={boardData[currentBoard].title + "에서 검색해보세요!"}
            onChange={keywordChangeHandler}
            value={searchKeyword}
          />
        </Search>
      )}
    </StyledUtils>
  );
};

export default Utils;

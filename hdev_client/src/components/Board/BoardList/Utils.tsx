import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { boardDataState, currentBoardState, searchKeywordState } from "../../../recoil/board";
import { ChangeEvent } from "react";

const StyledUtils = styled.div`
  width: 100%;
  min-height: 70px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  align-items: center;

  @media screen and (max-width: 767px) {
    width: 90%;
    min-height: 60px;
    align-items: center;
    position: relative;
  }
`;

const Search = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SearchIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.6 1.8C6.97268 1.8 2.40002 6.37266 2.40002 12C2.40002 17.6273 6.97268 22.2 12.6 22.2C14.8266 22.2 16.8844 21.4828 18.5625 20.2687L26.4563 28.1438L28.1438 26.4563L20.3438 18.6375C21.8766 16.8516 22.8 14.5336 22.8 12C22.8 6.37266 18.2274 1.8 12.6 1.8ZM12.6 3C17.5782 3 21.6 7.02187 21.6 12C21.6 16.9781 17.5782 21 12.6 21C7.6219 21 3.60002 16.9781 3.60002 12C3.60002 7.02187 7.6219 3 12.6 3Z"
        fill="#ABABAB"
      />
    </svg>
  );
};

const Input = styled.input`
  width: 90%;
  height: 50%;
  font-size: 15px;
`;

const MobileUtilButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid #e5e6e8;
`;

const MobileAddPostButton = styled(Link)`
  width: 80px;
  height: 40px;
  border-radius: 10px;
  position: absolute;
  background-color: #0064fe;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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
        <>
          <MobileUtilButton>
            <SearchIcon />
          </MobileUtilButton>
          <MobileAddPostButton to="/post/add">글작성</MobileAddPostButton>
        </>
      ) : (
        <>
          <Search>
            <SearchIcon />
            <Input
              placeholder={boardData[currentBoard].title + "에서 검색해보세요!"}
              onChange={keywordChangeHandler}
              value={searchKeyword}
            />
          </Search>
        </>
      )}
    </StyledUtils>
  );
};

export default Utils;

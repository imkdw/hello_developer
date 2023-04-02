import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledSearchHeader = styled.div`
  width: 100%;
  min-height: 140px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Subject = styled.div`
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

const SearchHeader = () => {
  return (
    <StyledSearchHeader>
      <Subject>
        <MainText>검색결과</MainText>
        <DescText>게시글들의 검색결과 입니다.</DescText>
      </Subject>
    </StyledSearchHeader>
  );
};

export default SearchHeader;

import styled from "styled-components";

const StyledSideMenuSearch = styled.div`
  width: 100%;
  height: 15%;
  max-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputWrapper = styled.div`
  width: 90%;
  height: 50%;
  border-radius: 25px;
  border: 1px solid #e5e6e8;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 80%;
  height: 95%;
  border-radius: 0 25px 25px 0;
  font-size: 16px;
`;

const SearchIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.5 1.5C5.81055 1.5 2 5.31055 2 10C2 14.6895 5.81055 18.5 10.5 18.5C12.3555 18.5 14.0703 17.9023 15.4688 16.8906L22.0469 23.4531L23.4531 22.0469L16.9531 15.5312C18.2305 14.043 19 12.1113 19 10C19 5.31055 15.1895 1.5 10.5 1.5ZM10.5 2.5C14.6484 2.5 18 5.85156 18 10C18 14.1484 14.6484 17.5 10.5 17.5C6.35156 17.5 3 14.1484 3 10C3 5.85156 6.35156 2.5 10.5 2.5Z"
        fill="#ABABAB"
      />
    </svg>
  );
};

const SideMenuSearch = () => {
  return (
    <StyledSideMenuSearch>
      <InputWrapper>
        <SearchIcon />
        <Input placeholder="검색어를 입력해주세요" />
      </InputWrapper>
    </StyledSideMenuSearch>
  );
};

export default SideMenuSearch;

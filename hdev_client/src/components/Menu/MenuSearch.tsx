import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SearchIcon } from "../../assets/icon";

const StyledMenuSearch = styled.form`
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

const MenuSearch = () => {
  const [searchText, setSearchText] = useState("");
  const navigator = useNavigate();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigator(`/search?text=${searchText}`);
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => [setSearchText(event.currentTarget.value)];

  return (
    <StyledMenuSearch onSubmit={submitHandler}>
      <InputWrapper>
        <SearchIcon />
        <Input placeholder="검색어를 입력해주세요" onChange={changeHandler} value={searchText} />
      </InputWrapper>
    </StyledMenuSearch>
  );
};

export default MenuSearch;

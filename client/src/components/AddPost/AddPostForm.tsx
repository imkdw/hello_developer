import styled from "styled-components";
import TextEditor from "./Editor";

const StyledAddPostForm = styled.form`
  flex: 6;
  height: auto;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  margin-top: 30px;
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-end;

  @media screen and (max-width: 767px) {
    /* gap: 20px; */
  }
`;

const Message = styled.p`
  width: 100%;
  font-size: 30px;

  @media screen and (max-width: 767px) {
    font-size: 24px;
  }
`;

const FormControl = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:last-child {
    height: 150px;
  }

  &:nth-child(5) {
    height: 310px;

    @media screen and (max-width: 767px) {
      height: 230px;
    }
  }
`;

const Label = styled.label`
  font-size: 20px;
`;

const Input = styled.input`
  height: 50px;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  padding: 0 10px;
  font-size: 16px;
`;

const Select = styled.select`
  height: 50px;
  outline: none;
  font-size: 16px;
  border: 1px solid #d0d0d0;
  border-radius: 10px;
  padding: 0 10px;
  cursor: pointer;
`;

const Option = styled.option``;

const Buttons = styled.div`
  width: 200px;
  min-height: 50px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 767px) {
    margin-bottom: 20px;
  }
`;

const CancelButton = styled.button`
  width: 90px;
  height: 100%;
  border: 1px solid #bebebe;
  border-radius: 10px;
`;
const SubmitButton = styled.button`
  width: 90px;
  height: 100%;
  background-color: #0090f9;
  color: white;
  border-radius: 10px;
`;

const AddPostForm = () => {
  return (
    <StyledAddPostForm>
      <Wrapper>
        <Message>헬로디벨로퍼 - 글작성</Message>
        <FormControl>
          <Label>토픽</Label>
          <Select>
            <Option>건의사항</Option>
            <Option>자유주제</Option>
            <Option>지식공유 - 꿀팁</Option>
            <Option>지식공유 - 기술</Option>
            <Option>질문답변 - 커리어</Option>
            <Option>질문답변 - 기술</Option>
            <Option>인원모집 - 프로젝트</Option>
            <Option>인원모집 - 스터디</Option>
            <Option>인원모집 - 채용공고</Option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>제목</Label>
          <Input type="text" placeholder="제목을 입력해주세요" />
        </FormControl>
        <FormControl>
          <Label>
            태그 -{" "}
            <span style={{ fontSize: "14px", color: "#005DFF" }}>
              내용을 대표하는 태그를 최대 3개까지 입력해주세요
            </span>
          </Label>
          <Input type="text" placeholder="태그를 # 기호로 구분해서 입력해주세요" />
        </FormControl>
        <FormControl>
          <Label>내용</Label>
          <TextEditor />
        </FormControl>
        <Buttons>
          <CancelButton>취소</CancelButton>
          <SubmitButton>등록</SubmitButton>
        </Buttons>
      </Wrapper>
    </StyledAddPostForm>
  );
};

export default AddPostForm;

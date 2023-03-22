import { ChangeEvent, useState, useCallback, FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../../recoil";
import { getBoard, updateBoard } from "../../../services/BoardService";
import { categoryValidation, contentValidation, titleValidation } from "../../../utils/Board";
import TextEditor from "./TextEditor";

const StyledUpdateBoardForm = styled.form`
  flex: 6;
  height: auto;
  display: flex;
  justify-content: center;
  overflow-y: scroll;

  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const Wrapper = styled.div`
  margin-top: 30px;
  width: 90%;
  height: 1300px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: flex-end;

  @media screen and (max-width: 767px) {
    gap: 20px;
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

  /* 내용 입력칸 */
  &:nth-last-of-type(2) {
    height: 700px;
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

const DisabledSubmitButton = styled.button`
  width: 90px;
  height: 100%;
  background-color: #5fbcff;
  color: white;
  border-radius: 10px;
  cursor: default;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    height: 150px;
  }
`;

const UpdateBoardForm = () => {
  const boardId = useParams().boardId as string;

  useEffect(() => {
    const loadBoard = async () => {
      const res = await getBoard(boardId);

      setBoardData((prevState) => {
        const category = res.data.category2
          ? `${res.data.category1.name}-${res.data.category2.name}`
          : res.data.category1.name;
        return { ...prevState, category, title: res.data.title, tags: res.data.tags, content: res.data.content };
      });

      setIsBoardDataValid({
        category: true,
        title: true,
        content: true,
      });
    };

    loadBoard();
  }, []);

  const [boardData, setBoardData] = useState({
    category: "none",
    title: "",
    tags: [{ name: "" }, { name: "" }, { name: "" }],
    content: "",
  });

  interface IsBoardDataValid {
    [key: string]: null | boolean;
  }

  const [isBoardDataValid, setIsBoardDataValid] = useState<IsBoardDataValid>({
    category: null,
    title: null,
    content: null,
  });

  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();

  const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;

    setBoardData((prevState) => {
      return { ...prevState, category: value };
    });

    setIsBoardDataValid((prevState) => {
      return { ...prevState, category: categoryValidation(value) };
    });
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setBoardData((prevState) => {
      return { ...prevState, title: value };
    });

    setIsBoardDataValid((prevState) => {
      return { ...prevState, title: titleValidation(value) };
    });
  };

  const changeTags = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    if (value.length > 10) {
      alert("태그는 최대 10자까지 입력이 가능합니다.");
      event.currentTarget.value = "";
      return;
    }

    switch (name) {
      case "tag1":
        setBoardData((prevState) => {
          return { ...prevState, tags: [{ name: value }, ...boardData.tags.slice(1)] };
        });
        break;
      case "tag2":
        setBoardData((prevState) => {
          return { ...prevState, tags: [boardData.tags[0], { name: value }, ...boardData.tags.slice(2)] };
        });
        break;
      case "tag3":
        setBoardData((prevState) => {
          return { ...prevState, tags: [boardData.tags[0], boardData.tags[1], { name: value }] };
        });
        break;
      default:
        break;
    }
  };

  const changeContent = useCallback((markdown: string) => {
    if (markdown.length < 1) {
      alert("내용은 한자리 이상 입력해야됩니다.");
      return;
    }

    setBoardData((prevState) => {
      return { ...prevState, content: markdown };
    });

    setIsBoardDataValid((prevState) => {
      return { ...prevState, content: contentValidation(markdown) };
    });
  }, []);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { title, category, tags, content } = boardData;

    try {
      await updateBoard(boardId, { title, category, tags, content }, loggedInUser.accessToken);

      alert("게시글 수정이 완료되었습니다.");
      navigator(-1);
    } catch (err: any) {
      const { status, data } = err.response;
      let message = "서버 오류입니다. 다시 시도해주세요.";
      switch (status) {
        case 400:
          switch (data.message) {
            case "invalid_title":
              message = "제목의 글이가 너무 길거나 짧습니다.";
              break;
            case "invalid_content":
              message = "본문의 글이가 너무 길거나 짧습니다.";
              break;
            case "invalid_category":
              message = "유효한 카테고리를 설정해주세요";
              break;
            case "invalid_tags":
              message = "하나의 태그는 10자까지 지정이 가능합니다";
              break;
          }
          break;

        case 401:
          switch (data.message) {
            case "unauthorized_user":
              message = "인증이 만료되었습니다. 다시 로그인해주세요";
          }
      }

      alert(message);
    }
  };

  return (
    <StyledUpdateBoardForm onSubmit={submitHandler}>
      <Wrapper>
        <Message>헬로디벨로퍼 - 글작성</Message>
        <FormControl>
          <Label>카테고리</Label>
          <Select onChange={changeCategory} value={boardData.category}>
            <option value="none">카테고리를 선택해주세요</option>
            <option value="suggestion">건의사항</option>
            <option value="free">자유주제</option>
            <option value="knowledge-tips">지식공유 - 꿀팁</option>
            <option value="knowledge-review">지식공유 - 리뷰</option>
            <option value="qna-career">질문답변 - 커리어</option>
            <option value="qna-tech">질문답변 - 기술</option>
            <option value="recruitment-project">인원모집 - 프로젝트</option>
            <option value="recruitment-study">인원모집 - 스터디</option>
            <option value="recruitment-company">인원모집 - 채용공고</option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>제목</Label>
          <Input
            type="text"
            placeholder="제목은 1~50자 사이로 입력해주세요"
            onChange={changeTitle}
            value={boardData.title}
          />
        </FormControl>
        <FormControl>
          <Label>
            태그 -{" "}
            <span style={{ fontSize: "14px", color: "#005DFF" }}>
              내용을 대표하는 태그를 10자까지 입력해주세요. (미입력 가능)
            </span>
          </Label>
          <InputWrapper>
            <Input
              type="text"
              placeholder="첫번째 태그"
              style={{ flex: 1 }}
              name="tag1"
              onChange={changeTags}
              value={boardData.tags[0]?.name}
            />
            <Input
              type="text"
              placeholder="두번째 태그"
              style={{ flex: 1 }}
              name="tag2"
              onChange={changeTags}
              value={boardData.tags[1]?.name}
            />
            <Input
              type="text"
              placeholder="세번째 태그"
              style={{ flex: 1 }}
              name="tag3"
              onChange={changeTags}
              value={boardData.tags[2]?.name}
            />
          </InputWrapper>
        </FormControl>
        <FormControl>
          <Label>내용</Label>
          {boardData.content && <TextEditor onChange={changeContent} value={boardData.content} />}
        </FormControl>
        <Buttons>
          <CancelButton>취소</CancelButton>
          {isBoardDataValid.category && isBoardDataValid.title && isBoardDataValid.content ? (
            <SubmitButton type="submit">등록</SubmitButton>
          ) : (
            <DisabledSubmitButton disabled type="button">
              등록
            </DisabledSubmitButton>
          )}
        </Buttons>
      </Wrapper>
    </StyledUpdateBoardForm>
  );
};

export default UpdateBoardForm;

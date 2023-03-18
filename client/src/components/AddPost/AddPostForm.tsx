import { ChangeEvent, useState, useCallback, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { PostService } from "../../services/post";
import { AddPostData } from "../../types/post";
import { categoryValidation, contentValidation, tagsValidation, titleValidation } from "../../utils/validation";
import TextEditor from "./TextEditor";

const StyledAddPostForm = styled.form`
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

const AddPostForm = () => {
  const [postData, setPostData] = useState<AddPostData>({
    category: "none",
    title: "",
    tags: [{ name: "" }, { name: "" }, { name: "" }],
    content: "",
  });

  interface IsPostDataValid {
    [key: string]: null | boolean;
  }

  const [isPostDataValid, setIsPostDataValid] = useState<IsPostDataValid>({
    category: null,
    title: null,
    content: null,
  });

  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();

  const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;

    setPostData((prevState) => {
      return { ...prevState, category: value };
    });

    setIsPostDataValid((prevState) => {
      return { ...prevState, category: categoryValidation(value) };
    });
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setPostData((prevState) => {
      return { ...prevState, title: value };
    });

    setIsPostDataValid((prevState) => {
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
        setPostData((prevState) => {
          return { ...prevState, tags: [{ name: value }, ...postData.tags.slice(1)] };
        });
        break;
      case "tag2":
        setPostData((prevState) => {
          return { ...prevState, tags: [postData.tags[0], { name: value }, ...postData.tags.slice(2)] };
        });
        break;
      case "tag3":
        setPostData((prevState) => {
          return { ...prevState, tags: [postData.tags[0], postData.tags[1], { name: value }] };
        });
        break;
      default:
        break;
    }
  };

  const changeContent = useCallback((markdown: string) => {
    setPostData((prevState) => {
      return { ...prevState, content: markdown };
    });

    setIsPostDataValid((prevState) => {
      return { ...prevState, content: contentValidation(markdown) };
    });
  }, []);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = {
      title: postData.title,
      category: postData.category,
      tags: postData.tags,
      content: postData.content,
    };

    try {
      const res = await PostService.add(loggedInUser.accessToken, body);

      if (res?.status === 201) {
        alert("게시글 작성이 완료되었습니다.");
        navigator(-1);
      }
    } catch (err: any) {
      let message = "";

      if (err.status === 400) {
        switch (err.data.message) {
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
      } else {
        message = "서버 오류입니다. 다시 시도해주세요";
      }

      alert(message);
    }
  };

  return (
    <StyledAddPostForm onSubmit={submitHandler}>
      <Wrapper>
        <Message>헬로디벨로퍼 - 글작성</Message>
        <FormControl>
          <Label>카테고리</Label>
          <Select onChange={changeCategory} value={postData.category}>
            <Option value="none">카테고리를 선택해주세요</Option>
            <Option value="suggestion">건의사항</Option>
            <Option value="free">자유주제</Option>
            <Option value="knowledge-tips">지식공유 - 꿀팁</Option>
            <Option value="knowledge-review">지식공유 - 리뷰</Option>
            <Option value="qna-career">질문답변 - 커리어</Option>
            <Option value="qna-tech">질문답변 - 기술</Option>
            <Option value="recruitment-project">인원모집 - 프로젝트</Option>
            <Option value="recruitment-study">인원모집 - 스터디</Option>
            <Option value="recruitment-company">인원모집 - 채용공고</Option>
          </Select>
        </FormControl>
        <FormControl>
          <Label>제목</Label>
          <Input
            type="text"
            placeholder="제목은 1~50자 사이로 입력해주세요"
            onChange={changeTitle}
            value={postData.title}
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
            <Input type="text" placeholder="첫번째 태그" style={{ flex: 1 }} name="tag1" onChange={changeTags} />
            <Input type="text" placeholder="두번째 태그" style={{ flex: 1 }} name="tag2" onChange={changeTags} />
            <Input type="text" placeholder="세번째 태그" style={{ flex: 1 }} name="tag3" onChange={changeTags} />
          </InputWrapper>
        </FormControl>
        <FormControl>
          <Label>내용</Label>
          <TextEditor onChange={changeContent} />
        </FormControl>
        <Buttons>
          <CancelButton>취소</CancelButton>
          {isPostDataValid.category && isPostDataValid.title && isPostDataValid.content ? (
            <SubmitButton type="submit">등록</SubmitButton>
          ) : (
            <DisabledSubmitButton disabled type="button">
              등록
            </DisabledSubmitButton>
          )}
        </Buttons>
      </Wrapper>
    </StyledAddPostForm>
  );
};

export default AddPostForm;

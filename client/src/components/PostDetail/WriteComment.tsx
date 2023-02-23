import { ChangeEvent, useState, FormEvent } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { PostService } from "../../services/post";

const StyledWriteComment = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const InputWrapper = styled.form`
  width: 94%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;

  @media screen and (max-width: 767px) {
    width: 82%;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  resize: none;
  outline: none;
  padding: 10px;
  font-size: 18px;

  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

const SubmitButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  background-color: #0090f9;
  color: white;
  font-size: 16px;
`;

const WriteComment = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const currentPostId = useRecoilValue(currentPostIdState);
  const setPostDetailData = useSetRecoilState(postDetailDataState);

  const [comment, setComment] = useState("");

  const commentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setComment(value);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const status = await PostService.addComment(currentPostId, comment, loggedInUser.accessToken);

      if (status === 201) {
        alert("댓글 작성이 완료되었습니다.");
        setComment("");
      }

      // 댓글 작성이후 api 호출해서 댓글 내용 최신화
      const { post } = await PostService.detail(currentPostId);
      setPostDetailData(post);
    } catch (err: any) {
      alert("에러발생");
    }
  };

  return (
    <StyledWriteComment>
      <Profile src={loggedInUser.profileImg} />
      <InputWrapper onSubmit={submitHandler}>
        <Textarea
          placeholder="사용자들의 댓글은 작성자에게 큰 힘이됩니다."
          onChange={commentChangeHandler}
          value={comment}
        />
        <SubmitButton type="submit">댓글 쓰기</SubmitButton>
      </InputWrapper>
    </StyledWriteComment>
  );
};

export default WriteComment;

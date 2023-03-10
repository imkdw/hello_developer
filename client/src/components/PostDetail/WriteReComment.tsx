import { ChangeEvent, useState, FormEvent } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { PostService } from "../../services/post";

const StyledWriteReComment = styled.div`
  align-self: flex-end;
  width: 99%;
  display: flex;
  border-left: 3px solid #d9d9d9;
  gap: 20px;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 20px;
`;

const InputWrapper = styled.form`
  width: 90%;
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

const DisableSubmitButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  background-color: #5fbcff;
  color: white;
  font-size: 16px;
  cursor: default;
`;

interface WriteReCommentProps {
  commentId: number;
  writingHanlder(commentId: number): void;
}

const WriteReComment = ({ commentId, writingHanlder }: WriteReCommentProps) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const setPostDetailData = useSetRecoilState(postDetailDataState);
  const currentPostId = useRecoilValue(currentPostIdState);

  const [reComment, setReComment] = useState("");
  const [isValidReComment, setIsValidReComment] = useState(false);

  const reCommentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setReComment(value);

    if (value.length === 0 || value.length > 200) {
      setIsValidReComment(false);
    } else {
      setIsValidReComment(true);
    }
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidReComment || reComment.length === 0 || reComment.length > 200) {
      alert("????????? 1~200??? ????????? ??????????????????");
      return;
    }

    try {
      const status = await PostService.addReComment(commentId, reComment, loggedInUser.accessToken);

      if (status === 201) {
        alert("????????? ????????? ?????????????????????.");
        setReComment("");
        // ?????? ???????????? api ???????????? ?????? ?????? ?????????
        const { post } = await PostService.detail(currentPostId);
        setPostDetailData(post);
        writingHanlder(commentId);
      }
    } catch (err: any) {
      alert("????????????");
    }
  };

  return (
    <StyledWriteReComment>
      <Profile src={loggedInUser.profileImg} />
      <InputWrapper onSubmit={submitHandler}>
        <Textarea placeholder="1~200??? ????????? ??????????????????" onChange={reCommentChangeHandler} value={reComment} />
        {isValidReComment ? (
          <SubmitButton type="submit">?????? ??????</SubmitButton>
        ) : (
          <DisableSubmitButton type="button" disabled>
            ?????? ??????
          </DisableSubmitButton>
        )}
      </InputWrapper>
    </StyledWriteReComment>
  );
};

export default WriteReComment;

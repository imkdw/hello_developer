import { ChangeEvent, useState, FormEvent } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { PostService } from "../../services/post";

const StyledUpdateReComment = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const InputWrapper = styled.form`
  width: 94%;
  height: 140px;
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
  height: 90px;
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

const Buttons = styled.div`
  display: flex;
  gap: 20px;
`;

const CancelButton = styled.button`
  width: 60px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #a8a8a8;
`;

const SubmitButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  background-color: #0090f9;
  color: white;
  font-size: 16px;
`;

interface UpdateReCommentProps {
  commentId: number;
  content: string;
  editingHandler(commentIdentifier: string): void;
  commentIdentifier: string;
}

const UpdateReComment = ({ commentId, content, editingHandler, commentIdentifier }: UpdateReCommentProps) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const currentPostId = useRecoilValue(currentPostIdState);
  const setPostDetailData = useSetRecoilState(postDetailDataState);

  const [comment, setComment] = useState(content);

  const commentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setComment(value);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const status = await PostService.updateReComment(commentId, comment, loggedInUser.accessToken);

      if (status === 200) {
        alert("????????? ?????????????????????.");
        setComment("");
        editingHandler(commentIdentifier);

        const { post } = await PostService.detail(currentPostId);
        setPostDetailData(post);
      }

      // ?????? ???????????? api ???????????? ?????? ?????? ?????????
      const { post } = await PostService.detail(currentPostId);
      setPostDetailData(post);
    } catch (err: any) {
      alert("????????????");
    }
  };

  return (
    <StyledUpdateReComment>
      <Profile src={loggedInUser.profileImg} />
      <InputWrapper onSubmit={submitHandler}>
        <Textarea
          placeholder="??????????????? ????????? ??????????????? ??? ???????????????."
          onChange={commentChangeHandler}
          value={comment}
        />
        <Buttons>
          <CancelButton type="button" onClick={() => editingHandler(commentIdentifier)}>
            ??????
          </CancelButton>
          <SubmitButton type="submit">????????????</SubmitButton>
        </Buttons>
      </InputWrapper>
    </StyledUpdateReComment>
  );
};

export default UpdateReComment;

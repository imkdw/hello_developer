import { ChangeEvent, useState, FormEvent } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../../recoil";
import { boardDetailState } from "../../../recoil/board";
import { getBoard } from "../../../services/BoardService";
import { updateComment } from "../../../services/CommentService";

const StyledUpdateComment = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
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

const DisableSubmitButton = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 10px;
  background-color: #5fbcff;
  color: white;
  font-size: 16px;
  cursor: default;
`;

interface UpdateCommentProps {
  commentId: number;
  content: string;
  editingHandler(commentIdentifier: string): void;
  commentIdentifier: string;
}

const UpdateComment = ({ commentId, content, editingHandler, commentIdentifier }: UpdateCommentProps) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [boardDetail, setBoardDetail] = useRecoilState(boardDetailState);

  const [comment, setComment] = useState(content);
  const [isValidComment, setIsValidComment] = useState(false);

  const commentChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.currentTarget;
    setComment(value);

    if (value.length === 0 || value.length > 200) {
      setIsValidComment(false);
    } else {
      setIsValidComment(true);
    }
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loggedInUser.accessToken) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    if (!isValidComment || comment.length === 0 || comment.length > 200) {
      alert("댓글은 1~200자 사이로 입력해주세요");
      return;
    }

    try {
      await updateComment(commentId, comment, loggedInUser.accessToken);

      alert("댓글 수정이 완료되었습니다.");
      setComment("");
      setIsValidComment(false);
      editingHandler(commentIdentifier);

      // 댓글 작성이후 api 호출해서 댓글 내용 최신화
      const res = await getBoard(boardDetail.boardId);
      setBoardDetail(res.data);
    } catch (err: any) {
      alert("에러발생");
    }
  };

  return (
    <StyledUpdateComment>
      <Profile src={loggedInUser.profileImg} />
      <InputWrapper onSubmit={submitHandler}>
        <Textarea placeholder="1~200자 사이로 입력해주세요" onChange={commentChangeHandler} value={comment} />
        {isValidComment ? (
          <SubmitButton type="submit">수정하기</SubmitButton>
        ) : (
          <DisableSubmitButton type="button" disabled>
            수정하기
          </DisableSubmitButton>
        )}
      </InputWrapper>
    </StyledUpdateComment>
  );
};

export default UpdateComment;

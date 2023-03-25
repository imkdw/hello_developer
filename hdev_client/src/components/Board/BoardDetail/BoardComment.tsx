import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { MenuIcon } from "../../../assets/icon";
import { loggedInUserState } from "../../../recoil";
import { boardDetailState } from "../../../recoil/board";
import { dateFormater } from "../../../utils/Common";
import CreateComment from "./CreateComment";
import { useState } from "react";
import { removeComment } from "../../../services/CommentService";
import UpdateComment from "./UpdateComment";
import { getBoard } from "../../../services";
import { ProfileImage } from "../../Common/User";

const StyledBoardComment = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CommentCount = styled.div`
  width: 100%;
  border-top: 1px solid;
  padding: 20px 0 20px 0;
`;

const Comment = styled.div`
  width: 100%;
  height: auto;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #d1d1d1;
  padding: 0 0 20px 0;
  gap: 20px;
`;

const Header = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  gap: 10px;
  position: relative;
`;
const Writer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Username = styled.p`
  font-size: 18px;
`;

const CreatedAt = styled.p`
  color: #767e8c;
`;
const MenuButton = styled.div`
  width: 100px;
  position: absolute;
  right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
`;

const ButtonMenu = styled.div`
  width: 100px;
  height: 80px;
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  position: absolute;
  top: 100%;
  left: 0;
`;

const Button = styled.button`
  width: 100%;
  height: 50%;
  border-radius: 10px;

  &:hover {
    background-color: #dbdbdb;
  }
`;

interface EnableButton {
  [key: string]: {
    isEnable: boolean;
  };
}

interface IsEditComment {
  [key: string]: {
    isEditing: boolean;
  };
}

const BoardComment = () => {
  const boardDetail = useRecoilValue(boardDetailState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [enableButton, setEnableButton] = useState<EnableButton>({});
  const [isEditComment, setIsEditComment] = useState<IsEditComment>({});
  const setBoardDetail = useSetRecoilState(boardDetailState);

  const enableButtonHandler = (commentIdentifier: string) => {
    setEnableButton((prevState) => {
      const existData = prevState[commentIdentifier];
      let newData;
      if (existData) {
        newData = { isEnable: !prevState[commentIdentifier].isEnable };
      } else {
        newData = {
          isEnable: true,
        };
      }

      return {
        ...prevState,
        [commentIdentifier]: newData,
      };
    });
  };

  /** 댓글 내 수정하기 창 컨트롤 */
  const editingHandler = (commentIdentifier: string) => {
    setIsEditComment((prevState) => {
      const existData = prevState[commentIdentifier];
      let newData;
      if (existData) {
        newData = {
          isEditing: !prevState[commentIdentifier].isEditing,
        };
      } else {
        newData = {
          isEditing: true,
        };
      }

      return {
        ...prevState,
        [commentIdentifier]: newData,
      };
    });
  };

  /** 댓글 삭제 */
  const commentDeleteHandler = async (commentId: number) => {
    const isRemove = window.confirm("삭제한 댓글은 복구가 불가능합니다. 정말 삭제하실껀가요?");
    if (isRemove) {
      try {
        await removeComment(commentId, loggedInUser.accessToken);
        // 댓글 작성이후 api 호출해서 댓글 내용 최신화
        const res = await getBoard(boardDetail.boardId);
        setBoardDetail(res.data);
      } catch (err: any) {
        const { status, data } = err.response;

        let errMessage = "서버 오류입니다. 다시 시도해주세요.";
        switch (status) {
          case 401:
            switch (data.message) {
              case "unauthorized_user":
                errMessage = "인증되지 않은 사용자입니다. 메일을 확인해주세요";
            }
            break;

          case 404:
            switch (data.message) {
              case "comment_not_found":
                errMessage = "댓글을 찾을 수 없습니다.";
            }
            break;
        }

        alert(errMessage);
      }
    }
  };

  return (
    <StyledBoardComment>
      <CommentCount>{boardDetail.comments.length}개의 댓글이 있습니다.</CommentCount>
      <CreateComment />
      {boardDetail.comments.map((comment) => (
        <Comment key={comment.commentId}>
          {isEditComment[`co-${comment.commentId}`]?.isEditing ? (
            <UpdateComment
              commentId={comment.commentId}
              content={comment.comment}
              editingHandler={editingHandler}
              commentIdentifier={"co-" + comment.commentId}
            />
          ) : (
            <>
              <Header>
                <ProfileImage profileImg={comment.user.profileImg} />
                <Writer>
                  <Username>{comment.user.nickname}</Username>
                  <CreatedAt>{dateFormater(comment.createdAt)}</CreatedAt>
                </Writer>
                {comment.user.userId === loggedInUser.userId && (
                  <MenuButton onClick={() => enableButtonHandler(`co-${comment.commentId}`)}>
                    <MenuIcon />
                    {enableButton[`co-${comment.commentId}`]?.isEnable && (
                      <ButtonMenu>
                        <Button onClick={() => editingHandler(`co-${comment.commentId}`)}>수정하기</Button>
                        <Button onClick={() => commentDeleteHandler(comment.commentId)}>삭제하기</Button>
                      </ButtonMenu>
                    )}
                  </MenuButton>
                )}
              </Header>
              <p>{comment.comment}</p>
            </>
          )}
        </Comment>
      ))}
    </StyledBoardComment>
  );
};

export default BoardComment;

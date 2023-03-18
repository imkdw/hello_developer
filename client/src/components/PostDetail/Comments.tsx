import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { useState } from "react";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { PostService } from "../../services/post";
import UpdateComment from "./UpdateComment";
import { dateFormat } from "../../utils/dateFormat";

const StyledComments = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
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

const Text = styled.div`
  width: 100%;
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

const MenuIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.125 15.625C4.85089 15.625 6.25 14.2259 6.25 12.5C6.25 10.7741 4.85089 9.375 3.125 9.375C1.39911 9.375 0 10.7741 0 12.5C0 14.2259 1.39911 15.625 3.125 15.625Z"
        fill="#A0A0A0"
      />
      <path
        d="M12.5 15.625C14.2259 15.625 15.625 14.2259 15.625 12.5C15.625 10.7741 14.2259 9.375 12.5 9.375C10.7741 9.375 9.375 10.7741 9.375 12.5C9.375 14.2259 10.7741 15.625 12.5 15.625Z"
        fill="#A0A0A0"
      />
      <path
        d="M21.875 15.625C23.6009 15.625 25 14.2259 25 12.5C25 10.7741 23.6009 9.375 21.875 9.375C20.1491 9.375 18.75 10.7741 18.75 12.5C18.75 14.2259 20.1491 15.625 21.875 15.625Z"
        fill="#A0A0A0"
      />
    </svg>
  );
};

interface EnableWriter {
  [key: number]: {
    isEnable: boolean;
  };
}

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

const Comments = () => {
  const [enableWriter, setEnableWriter] = useState<EnableWriter>({});
  const [enableButton, setEnableButton] = useState<EnableButton>({});
  const [isEditComment, setIsEditComment] = useState<IsEditComment>({});

  const currentPostId = useRecoilValue(currentPostIdState);
  const setPostDetailData = useSetRecoilState(postDetailDataState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const postDetailData = useRecoilValue(postDetailDataState);

  /** 댓글 순서를 입력시간에 따라 정렬 */
  const sortedComments = [...postDetailData.comments];
  sortedComments.sort((a, b) => a.commentId - b.commentId);

  /** 댓글 내 메뉴버튼 컨트롤 */
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

  /** 댓글 내 답글쓰기 창 컨트롤 */
  const writerHandler = (commentId: number) => {
    setEnableWriter((prevState) => {
      const existData = prevState[commentId];
      let newData;
      if (existData) {
        newData = {
          isEnable: !prevState[commentId].isEnable,
        };
      } else {
        newData = {
          isEnable: true,
        };
      }

      return {
        ...prevState,
        [commentId]: newData,
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
    try {
      const res = await PostService.deleteComment(commentId, loggedInUser.accessToken);

      if (res === 200 && window.confirm("정말 댓글을 삭제하실껀가요?")) {
        const { post } = await PostService.detail(currentPostId);
        setPostDetailData(post);
      }
    } catch (err: any) {
      console.error(err);
      alert("에러 발생");
    }
  };

  return (
    <StyledComments>
      {sortedComments.map((comment) => (
        <Comment key={comment.commentId}>
          {isEditComment[`co-${comment.commentId}`]?.isEditing ? (
            <UpdateComment
              commentId={comment.commentId}
              content={comment.content}
              editingHandler={editingHandler}
              commentIdentifier={"co-" + comment.commentId}
            />
          ) : (
            <>
              <Header>
                <Profile src={comment.user.profileImg} />
                <Writer>
                  <Username>{comment.user.nickname}</Username>
                  <CreatedAt>{dateFormat(comment.createdAtDate)}</CreatedAt>
                </Writer>
                {comment.userId === loggedInUser.userId && (
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
              <Text>{comment.content}</Text>
            </>
          )}
        </Comment>
      ))}
    </StyledComments>
  );
};

export default Comments;

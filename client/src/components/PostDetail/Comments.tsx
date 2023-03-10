import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import WriteReComment from "./WriteReComment";
import { useState } from "react";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { PostService } from "../../services/post";
import UpdateComment from "./UpdateComment";
import UpdateReComment from "./UpdateReComment";
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

const ReCommentButton = styled.button`
  color: #b3b3b3;
  text-align: start;
`;

const ReComment = styled.div`
  width: 99%;
  height: 140px;
  position: relative;
  border-left: 3px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  align-self: flex-end;
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

  /** ?????? ????????? ??????????????? ?????? ?????? */
  const sortedComments = [...postDetailData.comments];
  sortedComments.sort((a, b) => a.commentId - b.commentId);

  /** ?????? ??? ???????????? ????????? */
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

  /** ?????? ??? ???????????? ??? ????????? */
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

  /** ?????? ??? ???????????? ??? ????????? */
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

  /** ?????? ?????? */
  const commentDeleteHandler = async (commentId: number) => {
    try {
      const res = await PostService.deleteComment(commentId, loggedInUser.accessToken);

      if (res === 200 && window.confirm("?????? ????????? ??????????????????????")) {
        const { post } = await PostService.detail(currentPostId);
        setPostDetailData(post);
      }
    } catch (err: any) {
      console.error(err);
      alert("?????? ??????");
    }
  };

  /** ????????? ?????? */
  const reCommentDeleteHandler = async (reCommentId: number) => {
    try {
      const res = await PostService.deleteReComment(reCommentId, loggedInUser.accessToken);

      if (res === 200 && window.confirm("?????? ???????????? ??????????????????????")) {
        const { post } = await PostService.detail(currentPostId);
        setPostDetailData(post);
      }
    } catch (err: any) {
      console.error(err);
      alert("?????? ??????");
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
                        <Button onClick={() => editingHandler(`co-${comment.commentId}`)}>????????????</Button>
                        <Button onClick={() => commentDeleteHandler(comment.commentId)}>????????????</Button>
                      </ButtonMenu>
                    )}
                  </MenuButton>
                )}
              </Header>
              <Text>{comment.content}</Text>
              <ReCommentButton onClick={() => writerHandler(comment.commentId)}>
                {enableWriter[comment.commentId]?.isEnable ? "????????????" : "????????????"}
              </ReCommentButton>
            </>
          )}
          {enableWriter[comment.commentId]?.isEnable && (
            <WriteReComment commentId={comment.commentId} writingHanlder={writerHandler} />
          )}
          {comment.reComment.map((data) => (
            <ReComment key={data.reCommentId}>
              {isEditComment[`re-${data.reCommentId}`]?.isEditing ? (
                <UpdateReComment
                  commentId={data.reCommentId}
                  content={data.content}
                  editingHandler={editingHandler}
                  commentIdentifier={"re-" + data.reCommentId}
                />
              ) : (
                <>
                  <Header style={{ marginLeft: "10px" }}>
                    <Profile src={data.user.profileImg} />
                    <Writer>
                      <Username>{data.user.nickname}</Username>
                      <CreatedAt>{dateFormat(data.createdAtDate)}</CreatedAt>
                    </Writer>
                    {comment.userId === loggedInUser.userId && (
                      <MenuButton onClick={() => enableButtonHandler(`re-${data.reCommentId}`)}>
                        <MenuIcon />
                        {enableButton[`re-${data.reCommentId}`]?.isEnable && (
                          <ButtonMenu>
                            <Button onClick={() => editingHandler(`re-${data.reCommentId}`)}>????????????</Button>
                            <Button onClick={() => reCommentDeleteHandler(data.reCommentId)}>????????????</Button>
                          </ButtonMenu>
                        )}
                      </MenuButton>
                    )}
                  </Header>
                  <Text style={{ marginLeft: "10px" }}>{data.content}</Text>
                </>
              )}
            </ReComment>
          ))}
        </Comment>
      ))}
    </StyledComments>
  );
};

export default Comments;

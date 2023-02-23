import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { postDetailDataState } from "../../recoil/post.recoil";
import WriteReComment from "./WriteReComment";
import { useState } from "react";
import { PostDetailData, PostDetailDataComments } from "../../types/post";

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
  height: 120px;
  position: relative;
  border-left: 3px solid #d9d9d9;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  align-self: flex-end;
`;

const MenuButton = styled.div`
  position: absolute;
  right: 10px;
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

const Comments = () => {
  const postDetailData = useRecoilValue(postDetailDataState);
  const [enableWriter, setEnableWriter] = useState<EnableWriter>({});

  const tempComments = [...postDetailData.comments];
  tempComments.sort((a, b) => a.commentId - b.commentId);

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

  return (
    <StyledComments>
      {tempComments.map((comment) => (
        <Comment key={comment.commentId}>
          <Header>
            <Profile src={comment.user.profileImg} />
            <Writer>
              <Username>{comment.user.nickname}</Username>
              <CreatedAt>{comment.createdAtDate}</CreatedAt>
            </Writer>
            <MenuButton>
              <MenuIcon />
            </MenuButton>
          </Header>
          <Text>{comment.content}</Text>
          <ReCommentButton onClick={() => writerHandler(comment.commentId)}>
            {enableWriter[comment.commentId]?.isEnable ? "답글취소" : "답글쓰기"}
          </ReCommentButton>
          {enableWriter[comment.commentId]?.isEnable && <WriteReComment commentId={comment.commentId} />}
          {comment.reComment.map((data) => (
            <ReComment key={data.reCommentId}>
              <Header style={{ marginLeft: "10px" }}>
                <Profile src={data.user.profileImg} />
                <Writer>
                  <Username>{data.user.nickname}</Username>
                  <CreatedAt>{data.createdAtDate}</CreatedAt>
                </Writer>
                <MenuButton>
                  <MenuIcon />
                </MenuButton>
              </Header>
              <Text style={{ marginLeft: "10px" }}>{data.content}</Text>
            </ReComment>
          ))}
        </Comment>
      ))}
    </StyledComments>
  );
};

export default Comments;

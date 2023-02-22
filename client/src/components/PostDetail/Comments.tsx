import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { postDetailDataState } from "../../recoil/post.recoil";
import WriteReComment from "./WriteReComment";
import { useState } from "react";

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
  align-items: flex-start;
  padding: 0 0 20px 0;
  justify-content: space-between;
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
      {postDetailData.comments.map((comment) => (
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
        </Comment>
      ))}
      <Comment>
        <Header>
          <Profile src="data:image/png;base64,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" />
          <Writer>
            <Username>#username</Username>
            <CreatedAt>09:36</CreatedAt>
          </Writer>
        </Header>
        <Text>유용한 정보네요 감사합니다.</Text>
        <ReCommentButton>답글쓰기</ReCommentButton>
        <ReComment>
          <Header style={{ marginLeft: "10px" }}>
            <Profile src="data:image/png;base64,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" />
            <Writer>
              <Username>#username</Username>
              <CreatedAt>09:36</CreatedAt>
            </Writer>
            <MenuButton>
              <MenuIcon />
            </MenuButton>
          </Header>
          <Text style={{ marginLeft: "10px" }}>여기서 interface 부분은 아닌거같아요</Text>
        </ReComment>
      </Comment>
    </StyledComments>
  );
};

export default Comments;

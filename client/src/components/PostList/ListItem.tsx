import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledListItem = styled(Link)`
  width: 45%;
  min-height: 300px;
  border: 1px solid #e7e7e7;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  gap: 15px;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #e7e9eb;
  }

  &:nth-child(2n - 1) {
    margin-left: 3rem;
  }

  @media screen and (max-width: 767px) {
    width: 90%;

    &:nth-child(2n - 1) {
      margin-left: 0;
    }
  }
`;

const Writer = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.p`
  font-size: 18px;
`;

const CreatedAt = styled.p`
  color: #7d7d7d;
`;

const Content = styled.div`
  width: 90%;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.p`
  width: 100%;
  height: 25%;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 24px;
  display: block;
`;

const Paragraph = styled.p`
  width: 100%;
  height: 60%;
  display: block;
  overflow-y: scroll;
  text-overflow: ellipsis;
  font-size: 15px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
  }

  &::-webkit-scrollbar-track {
    background-color: #e2e2e2;
  }
`;

const Tag = styled.div`
  width: 90%;
  height: 20%;
  display: flex;
  gap: 10px;
`;

const Topic = styled.p`
  width: 10%;
  height: 100%;
  background-color: #d1e9fa;
  border-radius: 5px;
  color: #4394f9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Hashtag = styled.div`
  width: 80%;
  display: flex;
  gap: 10px;
`;

const HashtagText = styled.p``;

const ListItem = () => {
  return (
    <StyledListItem to="/post/1">
      <Writer>
        <Profile src="data:image/png;base64,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" />
        <ProfileData>
          <Username>#username</Username>
          <CreatedAt>09:36</CreatedAt>
        </ProfileData>
      </Writer>
      <Content>
        <Title>주니어 개발자가 많이들 실수하는 타입스크립트 타입지정 에러 10가지</Title>
        <Paragraph>
          타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다. 타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면
          안됩니다.타입스크립트 이렇게쓰면 안됩니다.타입스크립트 이렇게쓰면 안됩니다.
        </Paragraph>
      </Content>
      <Tag>
        <Topic>기술</Topic>
        <Hashtag>
          <HashtagText>#Typescript</HashtagText>
          <HashtagText>#Node.js</HashtagText>
        </Hashtag>
      </Tag>
    </StyledListItem>
  );
};

export default ListItem;

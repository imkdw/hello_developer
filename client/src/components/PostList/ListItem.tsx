import { copyFileSync } from "fs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { PostListData } from "../../types/post";
import { dateFormat } from "../../utils/dateFormat";

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
  width: auto;
  height: 100%;
  background-color: #d1e9fa;
  border-radius: 5px;
  color: #4394f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  padding: 3px 3px;
`;

const Hashtag = styled.div`
  width: 80%;
  display: flex;
  gap: 10px;
`;

const HashtagText = styled.p``;

const ListItem = ({ user, post }: PostListData) => {
  const topicData: { [key: number]: string } = {
    5: "꿀팁",
    6: "리뷰",
    8: "기술",
    9: "커리어",
    11: "프로젝트",
    12: "스터디",
    13: "채용공고",
  };

  return (
    <StyledListItem to={"/post/" + post.postId}>
      <Writer>
        <Profile src={user.profileImg} />
        <ProfileData>
          <Username>{user.nickname}</Username>
          <CreatedAt>{dateFormat(post.createdAtDate)}</CreatedAt>
        </ProfileData>
      </Writer>
      <Content>
        <Title>{post.title}</Title>
        <Paragraph>{post.content}</Paragraph>
      </Content>
      <Tag>
        {post.topic && <Topic>{topicData[post.topic]}</Topic>}
        <Hashtag>
          {post.tags.map((tag) => (
            <HashtagText key={tag.name}>#{tag.name}</HashtagText>
          ))}
        </Hashtag>
      </Tag>
    </StyledListItem>
  );
};

export default ListItem;

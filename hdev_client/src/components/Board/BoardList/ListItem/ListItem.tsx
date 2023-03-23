import { copyFileSync } from "fs";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { EyeIcon } from "../../../../assets/icon/BoardIcon";
import { IBoardItem } from "../../../../types/board";
import { dateFormater } from "../../../../utils/Common";
import { MarkdownViewer } from "../../../Common";

const StyledListItem = styled(Link)`
  width: 30%;
  min-height: 300px;
  border: 1px solid #e7e7e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  gap: 15px;
  cursor: pointer;
  margin-top: 30px;

  &:nth-of-type(-n + 3) {
    margin-top: 20px;
  }

  &:nth-child(3n + 1) {
    margin-left: 2%;
  }

  &:hover {
    background-color: #e7e9eb;
  }

  @media screen and (max-width: 767px) {
    width: 90%;
  }
`;

const Writer = styled.div`
  width: 90%;
  height: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
  height: 50px;
`;

const Username = styled.p`
  font-size: 18px;
`;

const CreatedAt = styled.p`
  color: #7d7d7d;
`;

const Content = styled.div`
  width: 90%;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.p`
  width: 100%;
  height: 30px;
  font-weight: bold;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 24px;
  display: block;
`;

const Paragraph = styled.p`
  width: 100%;
  height: 120px;
  display: block;
  overflow-y: scroll;
  text-overflow: ellipsis;
  font-size: 15px;
  border-radius: 5px;

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
  display: flex;
  gap: 10px;
`;

const Category = styled.p`
  background-color: #d1e9fa;
  border-radius: 5px;
  color: #4394f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 3px 7px;
  white-space: nowrap;
`;

const Hashtag = styled.div`
  width: 80%;
  display: flex;
  gap: 10px;
`;

const Views = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 10px;
  gap: 7px;
`;

const ViewCnt = styled.p`
  font-size: 14px;
  color: #7c7c7c;
`;

interface ListItemProps {
  board: IBoardItem;
}

const ListItem = ({ board }: ListItemProps) => {
  const koreanCategory: { [key: string]: string } = {
    tips: "꿀팁",
    review: "리뷰",
    tech: "기술",
    career: "커리어",
    project: "프로젝트",
    study: "스터디",
    company: "채용공고",
  };

  return (
    <StyledListItem to={"/boards/" + board.boardId}>
      <Writer>
        <Profile src={board.user.profileImg} />
        <ProfileData>
          <Username>{board.user.nickname}</Username>
          <CreatedAt>{dateFormater(board.createdAt)}</CreatedAt>
        </ProfileData>
        <Views>
          <EyeIcon />
          <ViewCnt>{board.view.viewCnt}</ViewCnt>
        </Views>
      </Writer>
      <Content>
        <Title>{board.title}</Title>
        <Paragraph>
          <MarkdownViewer content={board.content.slice(0, 100)} />
        </Paragraph>
      </Content>
      <Tag>
        {board.category2 && <Category>{koreanCategory[board.category2.name]}</Category>}
        <Hashtag>
          {board.tags.map((tag) => (
            <p key={tag.name}>#{tag.name}</p>
          ))}
        </Hashtag>
      </Tag>
    </StyledListItem>
  );
};

export default ListItem;

import { Link } from "react-router-dom";
import styled from "styled-components";
import { EyeIcon } from "../../assets/icon/BoardIcon";
import { dateFormater } from "../../utils/Common";

const StyledRecentItem = styled(Link)`
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e5e6e8;
  align-items: center;
  cursor: pointer;
  justify-content: flex-end;
  gap: 5px;

  @media screen and (max-width: 767px) {
    gap: 10px;
  }

  &:hover {
    background-color: #dbdbdb;
  }
`;

const Top = styled.div`
  width: 97%;
  height: auto;
  display: flex;
  align-items: center;
  position: relative;
  gap: 6px;
`;

const ProfileImage = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;

  @media screen and (max-width: 767px) {
    width: 30px;
    height: 30px;
  }
`;

const Username = styled.div`
  font-size: 16px;
  @media screen and (max-width: 767px) {
    font-size: 14px;
  }
`;

const CreatedAt = styled.div`
  position: absolute;
  margin-left: 20px;
  color: #7d7d7d;
  right: 0;
  font-size: 14px;
`;

const CommentCount = styled.div`
  position: absolute;
  top: 5px;
  right: 0;
  width: auto;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CountNumber = styled.div`
  color: #878787;
`;

const Bottom = styled.div`
  width: 97%;
  height: auto;
  display: flex;
  position: relative;
  margin-bottom: 5px;
  align-items: flex-end;
`;

const Title = styled.div`
  font-size: 19px;

  @media screen and (max-width: 767px) {
    font-size: 15px;
  }
`;

interface RecentItemProps {
  data: {
    boardId: string;
    title: string;
    createdAt: string;
    user: {
      nickname: string;
      profileImg: string;
    };
    view: {
      viewCnt: number;
    };
  };
}

const RecentItem = ({ data }: RecentItemProps) => {
  return (
    <StyledRecentItem to={`/boards/${data.boardId}`}>
      <Top>
        <ProfileImage src={data.user.profileImg} />
        <Username>{data.user.nickname}</Username>
        <CommentCount>
          <EyeIcon />
          <CountNumber>{data.view.viewCnt}</CountNumber>
        </CommentCount>
      </Top>
      <Bottom>
        <Title>{data.title}</Title>
        <CreatedAt>{dateFormater(data.createdAt)}</CreatedAt>
      </Bottom>
    </StyledRecentItem>
  );
};
export default RecentItem;

import { Link } from "react-router-dom";
import styled from "styled-components";

import { BellIcon, BookIcon, CheckIcon, PersonIcon, QuestionIcon, TalkBallonIcon } from "./SideMenuIcon";
import SideMenuLinkItem from "./SideMenuLinkItem";

const StyledSideMenuLink = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const PostLinks = styled.ul`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const UtilLinks = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
`;

const UtilLink = styled(Link)`
  font-size: 18px;
  color: #767e8c;
  margin: 0 0 30px 10px;
`;

const SideMenuLink = () => {
  const sideMenuData = [
    {
      id: "notice",
      to: "/notice",
      text: "공지사항",
      icon: BellIcon,
    },
    {
      id: "suggestion",
      to: "/suggestion",
      text: "건의사항",
      icon: CheckIcon,
    },
    {
      id: "free",
      to: "/free",
      text: "자유주제",
      icon: TalkBallonIcon,
    },
    {
      id: "knowledge",
      to: "/knowledge",
      text: "지식공유",
      icon: BookIcon,
    },
    {
      id: "qna",
      to: "/qna",
      text: "질문답변",
      icon: QuestionIcon,
    },
    {
      id: "recruitment",
      to: "/recruitment",
      text: "인원모집",
      icon: PersonIcon,
    },
  ];

  return (
    <StyledSideMenuLink>
      <PostLinks>
        {sideMenuData.map((data) => (
          <SideMenuLinkItem key={data.id} Icon={data.icon} to={data.to} text={data.text} />
        ))}
      </PostLinks>
      <UtilLinks>
        <UtilLink to="/login">로그인 / 회원가입</UtilLink>
      </UtilLinks>
    </StyledSideMenuLink>
  );
};

export default SideMenuLink;

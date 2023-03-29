import styled from "styled-components";
import { BellIcon, BookIcon, CheckIcon, PersonIcon, QuestionIcon, TalkBallonIcon } from "../../assets/icon";
import MenuLinkItem from "./MenuLinkItem";

const StyledMenuLink = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const BoardLinks = styled.ul`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media screen and (max-width: 767px) {
    gap: 20px;
  }
`;
const MenuLink = () => {
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
    <StyledMenuLink>
      <BoardLinks>
        {sideMenuData.map((data) => (
          <MenuLinkItem key={data.id} Icon={data.icon} to={data.to} text={data.text} />
        ))}
      </BoardLinks>
    </StyledMenuLink>
  );
};

export default MenuLink;

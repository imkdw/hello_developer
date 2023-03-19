import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { BellIcon, BookIcon, CheckIcon, PersonIcon, QuestionIcon, TalkBallonIcon } from "../../assets/icon";
import { loggedInUserState } from "../../recoil";
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
interface MenuLinkProps {
  onClick?: () => void;
}

const MenuLink = ({ onClick }: MenuLinkProps) => {
  const navigator = useNavigate();

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

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  // const logoutHandler = async () => {
  //   try {
  //     const res = await AuthService.logout(loggedInUser.userId, loggedInUser.accessToken);

  //     if (res?.status === 200) {
  //       setLoggedInUser((prevState) => {
  //         return { ...prevState, accessToken: "", userId: "", profileImg: "", nickname: "" };
  //       });

  //       alert("로그아웃이 완료되었습니다.");
  //       navigator("/main");
  //     }
  //   } catch (err: any) {
  //     alert("오류 발생");
  //     console.error(err);
  //   }
  // };

  return (
    <StyledMenuLink>
      <BoardLinks>
        {sideMenuData.map((data) => (
          <MenuLinkItem key={data.id} Icon={data.icon} to={data.to} text={data.text} onClick={onClick} />
        ))}
      </BoardLinks>
      {/* <UtilLinks>
        {loggedInUser.accessToken ? (
          <>
            <UtilLink to={"/profile/" + loggedInUser.userId}>프로필</UtilLink>
            <UtilLink to="" onClick={logoutHandler}>
              로그아웃
            </UtilLink>
          </>
        ) : (
          <UtilLink to="/login">로그인 / 회원가입</UtilLink>
        )}
      </UtilLinks> */}
    </StyledMenuLink>
  );
};

export default MenuLink;

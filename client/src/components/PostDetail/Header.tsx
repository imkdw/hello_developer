import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState } from "../../recoil/post.recoil";
import { useState } from "react";
import { PostService } from "../../services/post";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { dateFormat } from "../../utils/dateFormat";

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  margin-top: 30px;
  gap: 10px;
  position: relative;
`;

const Profile = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Writer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Username = styled.div`
  @media screen and (max-width: 767px) {
    font-size: 15px;
  }
`;

const CreatedAt = styled.div`
  @media screen and (max-width: 767px) {
    font-size: 13px;
  }
  color: #767e8c;
`;

const UtilButtons = styled.div`
  display: flex;
  position: absolute;
  right: 0;
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  @media screen and (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const ButtonMenu = styled.div`
  width: 100px;
  height: 80px;
  position: absolute;
  top: 100%;
  left: 0;
  border-radius: 10px;
  border: 1px solid #dbdbdb;
`;

const MenuItem = styled(Link)`
  width: 100%;
  height: 50%;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;

  &:hover {
    background-color: #dbdbdb;
  }
`;

const ShareIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.5 0C15.1074 0 13.1541 1.93457 13.125 4.32031L6.95898 7.41016C6.23438 6.87695 5.34058 6.5625 4.375 6.5625C1.96362 6.5625 0 8.52612 0 10.9375C0 13.3489 1.96362 15.3125 4.375 15.3125C5.34058 15.3125 6.23438 14.998 6.95898 14.4648L13.125 17.5547C13.1541 19.9404 15.1074 21.875 17.5 21.875C19.9114 21.875 21.875 19.9114 21.875 17.5C21.875 15.0886 19.9114 13.125 17.5 13.125C16.5703 13.125 15.7073 13.4207 14.998 13.918L9.02344 10.9375L14.998 7.95703C15.7073 8.45435 16.5703 8.75 17.5 8.75C19.9114 8.75 21.875 6.78638 21.875 4.375C21.875 1.96362 19.9114 0 17.5 0ZM17.5 0.875C19.438 0.875 21 2.43701 21 4.375C21 6.31299 19.438 7.875 17.5 7.875C16.7839 7.875 16.126 7.65283 15.5723 7.28711C15.5176 7.10425 15.3518 6.97778 15.1621 6.97266C15.1604 6.97095 15.1501 6.97437 15.1484 6.97266C14.5383 6.42065 14.1282 5.64819 14.0273 4.78516C14.1196 4.63135 14.1094 4.43652 14 4.29297C14.0444 2.39429 15.5894 0.875 17.5 0.875ZM13.2207 5.25C13.3831 6.04126 13.759 6.75391 14.2871 7.32812L8.66797 10.1445C8.51929 9.34473 8.16211 8.62354 7.64258 8.03906L13.2207 5.25ZM4.375 7.4375C5.18506 7.4375 5.93018 7.7041 6.52148 8.16211C6.52661 8.16553 6.53003 8.17236 6.53516 8.17578C6.53857 8.18433 6.5437 8.19458 6.54883 8.20312C6.58643 8.24927 6.63257 8.28516 6.68555 8.3125C6.68726 8.31421 6.69751 8.31079 6.69922 8.3125C7.35376 8.89355 7.78613 9.72241 7.86133 10.6504C7.81177 10.77 7.81689 10.905 7.875 11.0195C7.86646 11.0554 7.86133 11.0913 7.86133 11.1289C7.80835 12.0996 7.36743 12.9626 6.68555 13.5625C6.64453 13.5881 6.60693 13.6206 6.57617 13.6582C5.97461 14.1453 5.2124 14.4375 4.375 14.4375C2.43701 14.4375 0.875 12.8755 0.875 10.9375C0.875 8.99951 2.43701 7.4375 4.375 7.4375ZM8.66797 11.7305L14.2871 14.5469C13.759 15.1211 13.3831 15.8337 13.2207 16.625L7.64258 13.8359C8.16211 13.2515 8.51929 12.5303 8.66797 11.7305ZM17.5 14C19.438 14 21 15.562 21 17.5C21 19.438 19.438 21 17.5 21C15.562 21 14 19.438 14 17.5C14 16.4473 14.458 15.5022 15.1895 14.8613C15.1997 14.8528 15.2083 14.8442 15.2168 14.834C15.2185 14.8323 15.2288 14.8357 15.2305 14.834C15.3005 14.8049 15.3621 14.7571 15.4082 14.6973C15.9927 14.2615 16.7122 14 17.5 14Z"
        fill="#767E8C"
      />
    </svg>
  );
};

const BookmarkIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.40632 1C6.16803 1.04492 5.99616 1.25586 6.00007 1.5V23.5C5.99811 23.6797 6.09382 23.8457 6.24811 23.9355C6.40241 24.0273 6.59382 24.0273 6.75007 23.9375L12.5001 20.5781L18.2501 23.9375C18.4063 24.0273 18.5977 24.0273 18.752 23.9355C18.9063 23.8457 19.002 23.6797 19.0001 23.5V1.5C19.0001 1.22461 18.7755 1 18.5001 1H6.50007C6.48444 1 6.46882 1 6.45319 1C6.43757 1 6.42194 1 6.40632 1ZM7.00007 2H18.0001V22.625L12.7501 19.5625C12.5958 19.4727 12.4044 19.4727 12.2501 19.5625L7.00007 22.625V2Z"
        fill="#767E8C"
      />
    </svg>
  );
};

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

const Header = () => {
  const postDetailData = useRecoilValue(postDetailDataState);
  const { user } = postDetailData;
  const currentPostId = useRecoilValue(currentPostIdState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();

  interface EnableMenu {
    [key: string]: boolean;
  }
  const [enableMenu, setEnablueMenu] = useState<EnableMenu>({
    share: false,
    menu: false,
  });

  const enableMenuHandler = (menu: string) => {
    setEnablueMenu((prevState) => {
      return { ...prevState, [menu]: !prevState[menu] };
    });
  };

  const deleteHandler = async () => {
    try {
      if (window.confirm("정말 게시글을 삭제하실껀가요?")) {
        const res = await PostService.delete(currentPostId, loggedInUser.accessToken);

        if (res === 200) {
          alert("게시글 삭제가 완료되었습니다.");
          navigator(-1);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("에러 발생");
    }
  };

  return (
    <StyledHeader>
      <Profile src={postDetailData.user.profileImg} />
      <Writer>
        <Username>{user.nickname}</Username>
        <CreatedAt>
          {dateFormat(postDetailData.createdAt)} · 조회수 {postDetailData.viewCount}회
        </CreatedAt>
      </Writer>
      <UtilButtons>
        <Button onClick={() => enableMenuHandler("share")}>
          <ShareIcon />
          {enableMenu.share && (
            <ButtonMenu>
              <MenuItem to="">주소복사</MenuItem>
              <MenuItem to="">카카오톡</MenuItem>
            </ButtonMenu>
          )}
        </Button>
        <Button>
          <BookmarkIcon />
        </Button>
        <Button onClick={() => enableMenuHandler("menu")}>
          <MenuIcon />
          {enableMenu.menu && (
            <ButtonMenu>
              <MenuItem to={"/post/update/" + currentPostId}>수정하기</MenuItem>
              <MenuItem to="" onClick={deleteHandler}>
                삭제하기
              </MenuItem>
            </ButtonMenu>
          )}
        </Button>
      </UtilButtons>
    </StyledHeader>
  );
};

export default Header;

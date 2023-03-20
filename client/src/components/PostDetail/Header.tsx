import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPostIdState, postDetailDataState, postOfUserActivityState } from "../../recoil/post.recoil";
import { useState } from "react";
import { PostService } from "../../services/post";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { dateFormat } from "../../utils/dateFormat";
import { UserService } from "../../services/user";

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
  const [postOfUserActivity, setPostOfUserActivity] = useRecoilState(postOfUserActivityState);
  const navigate = useNavigate();
  const location = useLocation();

  interface EnableMenu {
    [key: string]: boolean;
  }
  const [enableMenu, setEnablueMenu] = useState<EnableMenu>({
    share: false,
    menu: false,
  });

  const enableMenuHandler = (menu: string) => {
    if (menu === "share") {
      setEnablueMenu((prevState) => {
        return { ...prevState, share: !prevState["share"], menu: false };
      });
    } else {
      setEnablueMenu((prevState) => {
        return { ...prevState, menu: !prevState["menu"], share: false };
      });
    }
  };

  const deleteHandler = async () => {
    try {
      if (window.confirm("정말 게시글을 삭제하실껀가요?")) {
        const res = await PostService.delete(currentPostId, loggedInUser.accessToken);

        if (res === 200) {
          alert("게시글 삭제가 완료되었습니다.");
          navigate(-1);
        }
      }
    } catch (err: any) {
      console.error(err);
      alert("에러 발생");
    }
  };

  const bookmarkHandler = async () => {
    try {
      if (postOfUserActivity.isBookmark) {
        // 기존에 북마크가 되있는 포스트는 북마크 삭제
        const res = await UserService.deleteBookmark(postDetailData.postId, loggedInUser.accessToken);

        setPostOfUserActivity((prevState) => {
          return { ...prevState, isBookmark: false };
        });

        alert("북마크가 취소되었습니다.");
      } else {
        // 기존에 북마크가 되어있지 않는 포스트는 북마크 추가
        const res = await UserService.addBookmark(postDetailData.postId, loggedInUser.accessToken);

        setPostOfUserActivity((prevState) => {
          return { ...prevState, isBookmark: true };
        });

        alert("북마크가 추가되었습니다.");
      }
    } catch (err: any) {
      alert("에러 발생");
    }
  };

  const copyUrlHandler = () => {
    navigator.clipboard.writeText("http://localhost:3000" + location.pathname);
    alert("주소 복사가 완료되었습니다.");
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
              <MenuItem to="" onClick={copyUrlHandler}>
                주소복사
              </MenuItem>
              <MenuItem to="">카카오톡</MenuItem>
            </ButtonMenu>
          )}
        </Button>
        <Button onClick={bookmarkHandler}>
          {postOfUserActivity.isBookmark ? <EnableBookmarkIcon /> : <DisableBookmarkIcon />}
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

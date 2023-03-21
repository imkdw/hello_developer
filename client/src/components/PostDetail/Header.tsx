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

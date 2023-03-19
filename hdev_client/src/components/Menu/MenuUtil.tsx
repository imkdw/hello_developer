import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil";
import { logout } from "../../services/AuthService";

const StyledMenuUtil = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border: 1px solid #dbdbdb;
  border-radius: 50%;
`;

const Nickname = styled(Link)`
  color: #767e8c;
`;

const AuthLinks = styled.div``;

const AuthLink = styled(Link)`
  color: #767e8c;
`;

const MenuUtil = () => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const onLogoutHandler = async () => {
    await logout(loggedInUser.userId, loggedInUser.accessToken);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("profileImg");
    localStorage.removeItem("nickname");
    localStorage.removeItem("userId");

    setLoggedInUser({
      accessToken: "",
      refreshToken: "",
      profileImg: "",
      nickname: "",
      userId: "",
    });
  };

  return (
    <StyledMenuUtil>
      {loggedInUser.accessToken && (
        <Profile>
          <ProfileImg src={loggedInUser.profileImg} />
          <Nickname to={"/users/" + loggedInUser.userId}>{loggedInUser.nickname}</Nickname>
        </Profile>
      )}

      <AuthLinks>
        {loggedInUser.accessToken ? (
          <AuthLink to="" onClick={onLogoutHandler}>
            로그아웃
          </AuthLink>
        ) : (
          <AuthLink to="/login">로그인 / 회원가입</AuthLink>
        )}
      </AuthLinks>
    </StyledMenuUtil>
  );
};
export default MenuUtil;

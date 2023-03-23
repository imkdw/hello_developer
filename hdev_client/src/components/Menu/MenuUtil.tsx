import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil";
import { logout } from "../../services/AuthService";
import { ProfileImage } from "../Common/User";

const StyledMenuUtil = styled.div`
  width: 85%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProfileWrapper = styled.div`
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
  const navigator = useNavigate();

  const onLogoutHandler = async () => {
    try {
      await logout(loggedInUser.userId, loggedInUser.accessToken);
    } catch (err: any) {
    } finally {
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

      navigator("/");
    }
  };

  return (
    <StyledMenuUtil>
      {loggedInUser.accessToken && (
        <>
          <ProfileWrapper>
            <ProfileImage profileImg={loggedInUser.profileImg} />
            <Nickname to={"/users/" + loggedInUser.userId}>{loggedInUser.nickname}</Nickname>
          </ProfileWrapper>
        </>
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

import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { enableMenuState, loggedInUserState } from "../../recoil";
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
  const setEnableMenu = useSetRecoilState(enableMenuState);

  const logoutHandler = async () => {
    try {
      await logout(loggedInUser.userId, loggedInUser.accessToken);
    } catch (err: any) {
    } finally {
      setLoggedInUser({
        accessToken: "",
        profileImg: "",
        nickname: "",
        userId: "",
      });

      localStorage.removeItem("loggedInUser");

      setEnableMenu(false);
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
          <AuthLink to="" onClick={logoutHandler}>
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

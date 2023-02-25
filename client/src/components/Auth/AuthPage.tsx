import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Intro } from "./common";
import { Login } from "./Login";
import { Register } from "./Register";

const StyledAuthPage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #eef2f5;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/** 인증 페이지 좌측에 파란색 도형 */
const AuthPageBar = styled.div`
  position: absolute;
  width: 30%;
  height: 100%;
  background-color: #799efb;
  left: 0;
`;

/** AuthPage에 표시할 중간 사각형 컨텐츠 */
const Content = styled.div`
  width: 60%;
  height: 80%;
  border-radius: 15px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

  @media screen and (max-width: 767px) {
    width: 90%;
    height: 90%;
  }
`;

/** 로그인, 회원가입 데이터를 입력받을 폼 */

const AuthPage = () => {
  /** 현재 접속중인 경로의 path 가져오기 */
  const pathname = useLocation().pathname;
  return (
    <StyledAuthPage>
      <AuthPageBar />
      <Content>
        <Intro />
        {pathname === "/login" && <Login />}
        {pathname === "/register" && <Register />}
      </Content>
    </StyledAuthPage>
  );
};

export default AuthPage;

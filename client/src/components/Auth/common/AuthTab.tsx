import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

const StyledAuthTab = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const TabButton = styled(Link)<{ $isFontWeightBold: boolean }>`
  width: 40%;
  height: 60%;
  font-size: 25px;
  cursor: pointer;
  font-weight: ${(props) => props.$isFontWeightBold && "bold"};
  text-align: center;

  &:first-child {
    border-right: 1px solid #cccccc;
  }
`;

const AuthTab = () => {
  /** 현재 접속중인 경로의 path 가져오기 */
  const pathname = useLocation().pathname;

  return (
    <StyledAuthTab>
      <TabButton $isFontWeightBold={pathname === "/login"} to="/login">
        로그인
      </TabButton>
      <TabButton $isFontWeightBold={pathname === "/register"} to="/register">
        회원가입
      </TabButton>
    </StyledAuthTab>
  );
};

export default AuthTab;

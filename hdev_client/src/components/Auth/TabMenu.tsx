import styled from "styled-components";
import { Link } from "react-router-dom";

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

interface AuthTabProps {
  type: string;
}

const AuthTab = ({ type }: AuthTabProps) => {
  return (
    <StyledAuthTab>
      <TabButton $isFontWeightBold={type === "/login"} to="/login">
        로그인
      </TabButton>
      <TabButton $isFontWeightBold={type === "/register"} to="/register">
        회원가입
      </TabButton>
    </StyledAuthTab>
  );
};

export default AuthTab;

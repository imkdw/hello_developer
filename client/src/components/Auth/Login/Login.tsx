import styled from "styled-components";
import { Logo } from "../../Common";
import { AuthLine, AuthTab, GithubButton, GithubIcon } from "../common";

const StyledLogin = styled.form`
  width: 50%;
  height: 100%;
  background-color: white;
  border-radius: 0 15px 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Login = () => {
  return (
    <StyledLogin>
      <AuthTab />
      <Logo width={200} height={100} />
      <GithubButton />
      <AuthLine />
    </StyledLogin>
  );
};

export default Login;

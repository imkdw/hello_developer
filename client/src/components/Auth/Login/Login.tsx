import styled from "styled-components";
import { Logo } from "../../Common";
import { AuthLine, AuthTab, GithubButton } from "../common";
import LoginForm from "./LoginForm";
import { FormEvent } from "react";

const StyledLogin = styled.div`
  width: 50%;
  height: auto;
  background-color: white;
  border-radius: 0 15px 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 100;

  @media screen and (max-width: 767px) {
    width: 100%;
    border-radius: 15px;
  }
`;

const Login = () => {
  const loginHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <StyledLogin>
      <AuthTab />
      <Logo width={200} height={70} />
      <GithubButton />
      <AuthLine />
      <LoginForm onSubmit={loginHandler} />
    </StyledLogin>
  );
};

export default Login;

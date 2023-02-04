import styled from "styled-components";

import { GithubIcon } from "./AuthIcon";

const StyledGithubButton = styled.button`
  width: 70%;
  height: 50px;
  border: 1px solid;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 18px;
  margin-top: 10px;

  @media screen and (max-width: 767px) {
    width: 90%;
  }
`;

const GithubButton = () => {
  return (
    <StyledGithubButton>
      <GithubIcon />
      Login With Github
    </StyledGithubButton>
  );
};

export default GithubButton;

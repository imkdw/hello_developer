import styled from "styled-components";
import { Logo } from "../../Common";
import { AuthTab } from "../common";

const StyledRegister = styled.div`
  width: 50%;
  height: 100%;
  background-color: white;
  border-radius: 0 15px 15px 0;
`;

const Register = () => {
  return (
    <StyledRegister>
      <AuthTab />
    </StyledRegister>
  );
};

export default Register;

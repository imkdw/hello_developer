import styled from "styled-components";
import { EmailIcon, PasswordIcon } from "../common";
import { FormEvent } from "react";

const StyledLoginForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
  gap: 20px;
  align-items: center;
  margin-top: 30px;
`;

const FormControl = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const Label = styled.label`
  width: 90%;
  font-size: 18px;
`;

const InputWrapper = styled.div`
  width: 90%;
  height: 40px;
  display: flex;
  border-radius: 10px;
  border: 1px solid #a6a6a6;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Input = styled.input`
  width: 85%;
  height: 100%;
  border-radius: 10px;
`;

const Button = styled.button`
  width: 90%;
  height: 40px;
  background-color: #2c65ff;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  margin-top: 50px;
`;

interface LoginFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  return (
    <StyledLoginForm onSubmit={onSubmit}>
      <FormControl>
        <Label>이메일</Label>
        <InputWrapper>
          <EmailIcon />
          <Input type="text" placeholder="이메일 입력해주세요" />
        </InputWrapper>
      </FormControl>
      <FormControl>
        <Label>비밀번호</Label>
        <InputWrapper>
          <PasswordIcon />
          <Input type="password" placeholder="비밀번호를 입력해주세요" />
        </InputWrapper>
      </FormControl>
      <Button type="submit">로그인</Button>
    </StyledLoginForm>
  );
};

export default LoginForm;

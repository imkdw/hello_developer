import styled from "styled-components";
import { EmailIcon, NicknameIcon, PasswordIcon } from "../common";
import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import { REGISTER_URL } from "../../../config/api";

const StyledRegisterForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
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
  height: 50px;
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
  font-size: 16px;
`;

const Button = styled.button`
  width: 90%;
  height: 40px;
  background-color: #2c65ff;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  margin-top: 60px;

  @media screen and (max-width: 767px) {
    margin-top: 20px;
  }
`;

// TODO: 회원가입시 사용자 입력값 검증로직 추가필요
const RegisterForm = () => {
  const [account, setAccount] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const { email, password, nickname } = account;

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await axios.post(REGISTER_URL, { email, password, nickname });
      if (res.status === 201) {
        alert("인증코드를 입력하신 이메일로 발송했습니다. 인증코드를 확인해주세요.");
      }
    } catch (err: any) {
      const status = err.response.status;
      const { code, message } = err.response.data;
      if (status === 400) {
        if (code === "auth-001" && message === "invalid_email") {
          alert("이메일 형식이 올바르지 않습니다.");
        } else if (code === "auth-002" && message === "invalid_password") {
          alert("비밀번호 형식이 올바르지 않습니다.");
        } else if (code === "auth-003" && message === "invalid_nickname") {
          alert("닉네임 형식이 올바르지 않습니다.");
        } else if (code === "auth-004" && message === "exist_email") {
          alert("이미 사용중인 이메일 입니다.");
        } else if (code === "auth-005" && message === "exist_nickname") {
          alert("이미 사용중인 닉네임 입니다.");
        }
      } else {
        alert("서버 오류입니다. 잠시후 다시 시도해주세요.");
        console.error(err);
      }
    }
  };

  const accountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setAccount((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <StyledRegisterForm onSubmit={submitHandler}>
      <FormControl>
        <Label>이메일</Label>
        <InputWrapper>
          <EmailIcon />
          <Input
            type="text"
            placeholder="이메일 입력해주세요"
            name="email"
            onChange={accountChangeHandler}
            value={email}
          />
        </InputWrapper>
      </FormControl>
      <FormControl>
        <Label>비밀번호</Label>
        <InputWrapper>
          <PasswordIcon />
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            name="password"
            onChange={accountChangeHandler}
            value={password}
          />
        </InputWrapper>
      </FormControl>
      <FormControl>
        <Label>닉네임</Label>
        <InputWrapper>
          <NicknameIcon />
          <Input
            type="text"
            placeholder="닉네임을 입력해주세요"
            name="nickname"
            onChange={accountChangeHandler}
            value={nickname}
          />
        </InputWrapper>
      </FormControl>
      <Button type="submit">회원가입</Button>
    </StyledRegisterForm>
  );
};

export default RegisterForm;

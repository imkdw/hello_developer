import styled from "styled-components";
import { EmailIcon, PasswordIcon } from "../common";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { loggedInUserState } from "../../../recoil/auth.recoil";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../../services/auth";
import { isLoadingState } from "../../../recoil/ui.recoil";

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
  margin-top: 50px;
`;

const LoginForm = () => {
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });

  const navigator = useNavigate();
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const setIsLoading = useSetRecoilState(isLoadingState);

  const accountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setAccount((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const res = await AuthService.login(account.email, account.password);
      const { accessToken, userId, profileImg, nickname } = res?.data;
      console.log(res?.data);

      if (res?.status === 200) {
        navigator("/main");

        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken, userId, profileImg, nickname };
        });
      }
    } catch (err: any) {
      let errMessage = "";
      switch (err.status) {
        case 400:
          errMessage = "이메일이 존재하지 않거나 비밀번호가 일치하지 않습니다.";
          break;
        case 401:
          errMessage = "인증되지 않은 사용자입니다. 이메일을 확인해주세요.";
          break;
        default:
          errMessage = "서버 오류입니다. 잠시후 다시 시도해주세요.";
      }

      alert(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledLoginForm onSubmit={submitHandler}>
      <FormControl>
        <Label>이메일</Label>
        <InputWrapper>
          <EmailIcon />
          <Input
            type="text"
            placeholder="이메일 입력해주세요"
            value={account.email}
            name="email"
            onChange={accountChangeHandler}
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
            value={account.password}
            name="password"
            onChange={accountChangeHandler}
          />
        </InputWrapper>
      </FormControl>
      <Button type="submit">로그인</Button>
    </StyledLoginForm>
  );
};

export default LoginForm;

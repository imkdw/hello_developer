/* eslint-disable */
import styled from "styled-components";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { EmailIcon, PasswordIcon } from "../../assets/icon";
import { login } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { isLoadingState, loggedInUserState } from "../../recoil";

const StyledLoginForm = styled.form`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const FormControl = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
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
  margin-top: 10px;
  background-color: white;
`;

const Input = styled.input`
  width: 85%;
  height: 100%;
  border-radius: 10px;
  font-size: 13px;
`;

const Button = styled.button`
  width: 90%;
  height: 40px;
  background-color: #2c65ff;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  margin-top: 10px;

  @media screen and (max-width: 767px) {
    margin-top: 20px;
  }
`;

const DisableButton = styled.button`
  width: 90%;
  height: 40px;
  background-color: #80a1fd;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  margin-top: 10px;
  cursor: default;

  @media screen and (max-width: 767px) {
    margin-top: 20px;
  }
`;

const LoginForm = () => {
  const [account, setAccount] = useState({
    email: "",
    password: "",
  });

  const setIsLoading = useSetRecoilState(isLoadingState);
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const navigator = useNavigate();

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const res = await login(account.email, account.password);

      const { accessToken, profileImg, nickname, userId } = res.data;

      setLoggedInUser((prevState) => {
        return { ...prevState, accessToken, profileImg, nickname, userId };
      });

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          accessToken,
          userId,
          profileImg,
          nickname,
        })
      );

      navigator("/main");
    } catch (err: any) {
      let errMessage = "서버 오류입니다. 다시 시도해주세요.";
      const { status, data } = err.response;
      switch (status) {
        case 400:
          switch (data.message) {
            case "invalid_email_or_password":
              errMessage = "존재하지않는 이메일이거나 비밀번호가 일치하지 않습니다.";
          }
          break;
        case 401:
          switch (data.message) {
            case "unauthorized_user":
              errMessage = "인증되지 않은 사용자입니다. 메일을 확인해주세요";
          }
      }

      alert(errMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const accountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setAccount((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <StyledLoginForm onSubmit={submitHandler}>
      <FormControl>
        <Label>이메일</Label>
        <InputWrapper>
          <EmailIcon />
          <Input
            type="text"
            placeholder="이메일을 입력해주세요"
            name="email"
            onChange={accountChangeHandler}
            value={account.email}
            autoCapitalize="off"
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
            value={account.password}
            autoCapitalize="off"
            autoComplete="off"
          />
        </InputWrapper>
      </FormControl>
      {account.email && account.password ? (
        <Button type="submit">로그인</Button>
      ) : (
        <DisableButton type="button" disabled>
          로그인
        </DisableButton>
      )}
    </StyledLoginForm>
  );
};

export default LoginForm;

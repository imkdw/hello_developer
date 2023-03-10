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
      const { status, data } = await AuthService.login(account.email, account.password);
      const { accessToken, userId, profileImg, nickname } = data;

      if (status === 200) {
        navigator("/main");

        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken, userId, profileImg, nickname };
        });
      }

      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      let errMessage = "";

      switch (err.status) {
        case 400:
          errMessage = "???????????? ???????????? ????????? ??????????????? ???????????? ????????????.";
          break;
        case 401:
          errMessage = "???????????? ?????? ??????????????????. ???????????? ??????????????????.";
          break;
        default:
          errMessage = "?????? ???????????????. ????????? ?????? ??????????????????.";
      }

      alert(errMessage);
    }
  };

  return (
    <StyledLoginForm onSubmit={submitHandler}>
      <FormControl>
        <Label>?????????</Label>
        <InputWrapper>
          <EmailIcon />
          <Input
            type="text"
            placeholder="????????? ??????????????????"
            value={account.email}
            name="email"
            onChange={accountChangeHandler}
          />
        </InputWrapper>
      </FormControl>
      <FormControl>
        <Label>????????????</Label>
        <InputWrapper>
          <PasswordIcon />
          <Input
            type="password"
            placeholder="??????????????? ??????????????????"
            value={account.password}
            name="password"
            onChange={accountChangeHandler}
          />
        </InputWrapper>
      </FormControl>
      <Button type="submit">?????????</Button>
    </StyledLoginForm>
  );
};

export default LoginForm;

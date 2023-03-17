import styled from "styled-components";
import { EmailIcon, NicknameIcon, PasswordIcon } from "../common";
import { ChangeEvent, FormEvent, useState } from "react";
import { AuthService } from "../../../services/auth";
import { emailValidation, nicknameValidation, passwordValidation } from "../../../utils/validation";
import { useSetRecoilState } from "recoil";
import { isLoadingState } from "../../../recoil/ui.recoil";

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
`;

const Input = styled.input`
  width: 85%;
  height: 100%;
  border-radius: 10px;
  font-size: 13px;

  @media screen and (max-width: 767px) {
    font-size: 11px;
  }
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

const ErrMessage = styled.p`
  width: 90%;
  color: red;
  margin-top: 5px;
`;

const RegisterForm = () => {
  const [account, setAccount] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  const [isValidAccount, setIsValidAccount] = useState({
    email: null,
    password: null,
    nickname: null,
  });

  const setIsLoading = useSetRecoilState(isLoadingState);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!(isValidAccount.email || isValidAccount.password || isValidAccount.nickname)) {
      alert("올바르지 않은 계정 형식입니다.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await AuthService.register(account.email, account.password, account.nickname);

      if (res.status === 201) {
        alert("인증코드를 입력하신 이메일로 발송했습니다. 인증코드를 확인해주세요.");
      }

      setIsLoading(false);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      if (err.status === 400) {
        let errMessage: string = "";

        switch (err.data.message) {
          case "invalid_email":
            errMessage = "이메일 형식이 올바르지 않습니다.";
            break;
          case "invalid_password":
            errMessage = "비밀번호 형식이 올바르지 않습니다.";
            break;
          case "invalid_nickname":
            errMessage = "닉네임 형식이 올바르지 않습니다.";
            break;
          case "exist_email":
            errMessage = "중복된 이메일 입니다.";
            break;
          case "exist_nickname":
            errMessage = "중복된 닉네임 입니다.";
            break;
        }

        alert(errMessage);
      } else {
        alert("서버 오류입니다. 잠시후 다시 시도해주세요.");
      }
    }
  };

  const accountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setAccount((prevState) => {
      return { ...prevState, [name]: value };
    });

    let validator: boolean;
    switch (name) {
      case "email":
        validator = emailValidation(value);
        break;
      case "password":
        validator = passwordValidation(value);
        break;
      case "nickname":
        validator = nicknameValidation(value);
        break;
    }

    setIsValidAccount((prevState) => {
      return { ...prevState, [name]: validator };
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
            placeholder="이메일 형식에 맞추어 입력해주세요"
            name="email"
            onChange={accountChangeHandler}
            value={account.email}
          />
        </InputWrapper>
        {isValidAccount.email !== null && !isValidAccount.email && (
          <ErrMessage>이메일 형식이 올바르지 않습니다.</ErrMessage>
        )}
      </FormControl>
      <FormControl>
        <Label>비밀번호</Label>
        <InputWrapper>
          <PasswordIcon />
          <Input
            type="password"
            placeholder="영문, 숫자, 특수문자를 포함하여 10자리 이상 입력해주세요"
            name="password"
            onChange={accountChangeHandler}
            value={account.password}
          />
        </InputWrapper>
        {isValidAccount.password !== null && !isValidAccount.password && (
          <ErrMessage>비밀번호 형식이 올바르지 않습니다.</ErrMessage>
        )}
      </FormControl>
      <FormControl>
        <Label>닉네임</Label>
        <InputWrapper>
          <NicknameIcon />
          <Input
            type="text"
            placeholder="공백과 특수문자없이 8자리 이하로 입력해주세요"
            name="nickname"
            onChange={accountChangeHandler}
            value={account.nickname}
          />
        </InputWrapper>
        {isValidAccount.nickname !== null && !isValidAccount.nickname && (
          <ErrMessage>닉네임 형식이 올바르지 않습니다.</ErrMessage>
        )}
      </FormControl>
      {isValidAccount.nickname && isValidAccount.password && isValidAccount.nickname ? (
        <Button type="submit">회원가입</Button>
      ) : (
        <DisableButton type="button" disabled>
          회원가입
        </DisableButton>
      )}
    </StyledRegisterForm>
  );
};

export default RegisterForm;

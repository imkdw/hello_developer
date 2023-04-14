import styled from "styled-components";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSetRecoilState } from "recoil";
import { EmailIcon, NicknameIcon, PasswordIcon } from "../../assets/icon";
import { emailValidation, nicknameValidation, passwordValidation } from "../../utils/Auth";
import { register } from "../../services";
import { isLoadingState } from "../../recoil";

const StyledRegisterForm = styled.form`
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

  @media screen and (max-width: 767px) {
    font-size: 12px;
  }
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
      const { email, password, nickname } = account;
      const res = await register(email, password, nickname);

      if (res?.status === 201) {
        alert("인증코드를 입력하신 이메일로 발송했습니다. 인증코드를 확인해주세요.");
      }
    } catch (err: any) {
      let errMessage = "서버 오류입니다. 다시 시도해주세요.";
      if (err.response.status !== 500) {
        switch (err.response.data.message) {
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
          default:
            errMessage = "서버 오류입니다. 다시 시도해주세요";
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
            autoCapitalize="off"
          />
        </InputWrapper>
        {isValidAccount.email !== null && !isValidAccount.email && account.email.length !== 0 && (
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
            autoCapitalize="off"
            autoComplete="off"
          />
        </InputWrapper>
        {isValidAccount.password !== null && !isValidAccount.password && account.password.length !== 0 && (
          <ErrMessage>비밀번호 형식이 올바르지 않습니다.</ErrMessage>
        )}
      </FormControl>
      <FormControl>
        <Label>닉네임</Label>
        <InputWrapper>
          <NicknameIcon />
          <Input
            type="text"
            placeholder="공백과 특수문자없이 2~8자리로 입력해주세요"
            name="nickname"
            onChange={accountChangeHandler}
            value={account.nickname}
            autoCapitalize="off"
          />
        </InputWrapper>
        {isValidAccount.nickname !== null && !isValidAccount.nickname && account.nickname.length !== 0 && (
          <ErrMessage>닉네임 형식이 올바르지 않습니다.</ErrMessage>
        )}
      </FormControl>
      {isValidAccount.email && isValidAccount.password && isValidAccount.nickname ? (
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

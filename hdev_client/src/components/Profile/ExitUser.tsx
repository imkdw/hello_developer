import styled from "styled-components";
import { FormEvent, useState, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { exitUser, exitUserVerify } from "../../services/UserService";
import { loggedInUserState } from "../../recoil";
import { useNavigate } from "react-router-dom";

const Form = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;

  @media screen and (max-width: 767px) {
    height: 300px;
  }
`;

const FormControl = styled.div`
  width: 95%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 22px;

  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const LabelDesc = styled.span`
  font-size: 14px;
  color: #0090f9;

  @media screen and (max-width: 767px) {
    font-size: 13px;
  }
`;

const Input = styled.input`
  height: 50px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid #a1a1a1;
  padding: 0 10px;
`;

const Buttons = styled.div`
  width: auto;
  height: 50px;
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const Button = styled.button`
  font-size: 17px;
  width: 80px;
  background-color: #ff5353;
  color: white;
  border-radius: 10px;
`;

const Warnings = styled.div`
  display: flex;
  flex-direction: column;
`;

const WarningMessage = styled.p`
  color: red;
`;

const DisableButton = styled.button`
  font-size: 17px;
  width: 80px;
  background-color: #ffc6c6;
  color: white;
  border-radius: 10px;
  cursor: default;
`;

interface ExitUSerProps {
  userId: string;
}

const ExitUser = ({ userId }: ExitUSerProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [password, setPassword] = useState("");
  const navigator = useNavigate();

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const submitHanlder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await exitUserVerify(userId, password, loggedInUser.accessToken);

      if (res.data.accessToken) {
        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken: res.data.accessToken };
        });
      }

      if (res.status === 200) {
        await exitUser(userId, loggedInUser.accessToken);
        alert("회원탈퇴가 완료되었습니다.");

        setLoggedInUser({
          accessToken: "",
          nickname: "",
          profileImg: "",
          userId: "",
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("profileImg");
        localStorage.removeItem("nickname");
        localStorage.removeItem("userId");

        navigator("/");
      }
    } catch (err: any) {
      const { status } = err.response;

      let errMessage = "서버 오류입니다. 다시 시도해주세요.";
      switch (status) {
        case 400:
          errMessage = "비밀번호가 일치하지 않습니다.";
          break;

        case 401:
          errMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
          break;

        case 404:
          errMessage = "사용자를 찾을수 없습니다.";
      }

      alert(errMessage);
    }
  };

  return (
    <Form onSubmit={submitHanlder}>
      <FormControl>
        <Label>
          비밀번호 - <LabelDesc>비밀번호를 입력해주세요</LabelDesc>
        </Label>
        <Input type="password" name="password" placeholder="비밀번호를 입력해주세요" onChange={changeHandler} />
        <Warnings>
          <WarningMessage>1. 회원탈퇴시 데이터 복구가 불가능합니다.</WarningMessage>
          <WarningMessage>2. 회원탈퇴시 작성한 글, 댓글 등 모든 데이터가 사라집니다.</WarningMessage>
        </Warnings>
      </FormControl>
      {loggedInUser.userId === userId && (
        <Buttons>
          {password ? (
            <Button type="submit">탈퇴하기</Button>
          ) : (
            <DisableButton type="button" disabled>
              탈퇴하기
            </DisableButton>
          )}
        </Buttons>
      )}
    </Form>
  );
};
export default ExitUser;

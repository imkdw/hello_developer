import styled from "styled-components";
import { FormEvent, useState, ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../recoil";
import { passwordValidation } from "../../../utils/Auth";
import { updatePassword } from "../../../services/UserService";

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
    font-size: 18px;
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
  background-color: #0090f9;
  color: white;
  border-radius: 10px;
`;

const DisableButton = styled.button`
  font-size: 17px;
  width: 80px;
  background-color: #5fbcff;
  color: white;
  border-radius: 10px;
  cursor: default;
`;

interface UpdatePasswordProps {
  userId: string;
}

interface IsValidUpdateData {
  [key: string]: boolean | null;
}

const UpdatePassword = ({ userId }: UpdatePasswordProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const [updateData, setUpdateData] = useState({
    password: "",
    rePassword: "",
  });

  const [isValidUpdateData, setIsValidUpdateData] = useState<IsValidUpdateData>({
    password: null,
    rePassword: null,
  });

  const updateDataChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setUpdateData((prevState) => {
      return { ...prevState, [name]: value };
    });

    setIsValidUpdateData((prevState) => {
      let isValid = false;

      switch (name) {
        case "rePassword":
          isValid = passwordValidation(value);
          break;
      }

      return { ...prevState, [name]: isValid };
    });
  };

  const submitHanlder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await updatePassword(userId, updateData, loggedInUser.accessToken);

      if (res.data.accessToken) {
        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken: res.data.accessToken };
        });
      }

      alert("비밀번호 변경이 완료되었습니다");
      setUpdateData({
        password: "",
        rePassword: "",
      });
    } catch (err: any) {
      const { status, data } = err.response;

      let errMessage = "서버 오류입니다. 다시 시도해주세요.";
      switch (status) {
        case 400:
          switch (data.message) {
            case "invalid_nickname":
              errMessage = "닉네임 형식이 잘못됬습니다.";
              break;
            case "invalid_introduce":
              errMessage = "자기소개 형식이 잘못되었습니다";
              break;
          }
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
          기존 비밀번호 - <LabelDesc>기존 비밀번호를 입력해주세요</LabelDesc>
        </Label>
        <Input
          type="password"
          name="password"
          value={updateData.password}
          onChange={updateDataChangeHandler}
          placeholder="비밀번호를 입력해주세요"
        />
      </FormControl>
      <FormControl>
        <Label>
          변경 비밀번호 - <LabelDesc>변경하고싶은 비밀번호를 입력해주세요</LabelDesc>
        </Label>
        <Input
          type="password"
          name="rePassword"
          value={updateData.rePassword}
          onChange={updateDataChangeHandler}
          placeholder="영문, 숫자, 특수문자를 포함하여 10자리 이상"
        />
      </FormControl>
      {loggedInUser.userId === userId && (
        <Buttons>
          {isValidUpdateData.rePassword ? (
            <Button type="submit">저장하기</Button>
          ) : (
            <DisableButton type="button" disabled>
              저장하기
            </DisableButton>
          )}
        </Buttons>
      )}
    </Form>
  );
};
export default UpdatePassword;

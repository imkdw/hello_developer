import styled from "styled-components";
import { FormEvent, useState, ChangeEvent, MouseEvent } from "react";
import { updateProfile } from "../../../services/UserService";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../recoil";
import { userInfoState } from "../../../recoil/user";
import { nicknameValidation } from "../../../utils/Auth";

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

interface UpdateProfileProps {
  userId: string;
}

interface IsValidUpdateData {
  [key: string]: boolean | null;
}

const UpdateProfile = ({ userId }: UpdateProfileProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);

  const [updateData, setUpdateData] = useState({
    nickname: userInfo.nickname,
    introduce: userInfo.introduce,
  });

  const [isValidUpdateData, setIsValidUpdateData] = useState<IsValidUpdateData>({
    nickname: null,
    introduce: null,
  });

  const [isEdit, setIsEdit] = useState(false);

  const editHandler = () => {
    setIsEdit(!isEdit);
  };

  const buttonHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const updateDataChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setUpdateData((prevState) => {
      return { ...prevState, [name]: value };
    });

    setIsValidUpdateData((prevState) => {
      let isValid = false;

      switch (name) {
        case "nickname":
          isValid = nicknameValidation(value);
          break;
        case "introduce":
          isValid = value.length < 31;
          break;
      }

      return { ...prevState, [name]: isValid };
    });
  };

  const submitHanlder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const res = await updateProfile(userId, updateData, loggedInUser.accessToken);

      if (res.data.accessToken) {
        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken: res.data.accessToken };
        });
      }

      alert("회원정보 수정이 완료되었습니다.");

      setUserInfo((prevState) => {
        return { ...prevState, nickname: updateData.nickname, introduce: updateData.introduce };
      });

      localStorage.setItem("nickname", updateData.nickname);
      setLoggedInUser((prevState) => {
        return { ...prevState, nickname: updateData.nickname };
      });
      setIsEdit(false);
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
          닉네임 - <LabelDesc>사용자를 대표하는 이름입니다</LabelDesc>
        </Label>
        {isEdit ? (
          <Input
            type="text"
            name="nickname"
            value={updateData.nickname}
            onChange={updateDataChangeHandler}
            placeholder="공백과 특수문자없이 8자리 이하로 입력해주세요"
          />
        ) : (
          <Input type="text" name="nickname" value={userInfo.nickname} disabled />
        )}
      </FormControl>
      <FormControl>
        <Label>
          자기소개 - <LabelDesc>나는 어떤사람인지 소개해보세요</LabelDesc>
        </Label>
        {isEdit ? (
          <Input
            type="text"
            name="introduce"
            value={updateData.introduce}
            onChange={updateDataChangeHandler}
            placeholder="자기소개는 최대 30자까지 입력이 가능합니다"
            autoComplete="false"
          />
        ) : (
          <Input type="text" name="introduce" value={userInfo.introduce} disabled />
        )}
      </FormControl>
      {loggedInUser.userId === userId &&
        (isEdit ? (
          <Buttons>
            {isValidUpdateData.nickname && isValidUpdateData.introduce ? (
              <Button type="submit">저장하기</Button>
            ) : (
              <DisableButton type="button" disabled onClick={buttonHandler}>
                저장하기
              </DisableButton>
            )}
            <Button
              type="button"
              onClick={(event) => {
                editHandler();
                buttonHandler(event);
              }}
            >
              취소하기
            </Button>
          </Buttons>
        ) : (
          <Buttons>
            <Button
              type="button"
              onClick={(event) => {
                editHandler();
                buttonHandler(event);
              }}
            >
              수정하기
            </Button>
          </Buttons>
        ))}
    </Form>
  );
};
export default UpdateProfile;

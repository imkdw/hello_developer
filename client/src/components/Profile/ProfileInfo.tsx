import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { userProfileState } from "../../recoil/user.recoil";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { UserProfileUpdateData } from "../../types/user";
import { UserService } from "../../services/user";
import { nicknameValidation, passwordValidation } from "../../utils/validation";
import ProfileImage from "./Info/ProfileImage";

const StyledProfileInfo = styled.div`
  width: 48%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const FormControl = styled.div`
  width: 95%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 24px;
`;

const LabelDesc = styled.span`
  font-size: 16px;
  color: #0090f9;
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

const UpdateButton = styled.button`
  font-size: 17px;
  width: 80px;
  background-color: #0090f9;
  color: white;
  border-radius: 10px;
`;

const ExitUserButton = styled.button`
  font-size: 17px;
  width: 80px;
  background-color: #ff0000;
  color: white;
  border-radius: 10px;
`;

const ProfileInfo = () => {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [loggedInUser, setLoggedInuser] = useRecoilState(loggedInUserState);

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [updateData, setUpdateData] = useState<UserProfileUpdateData>({
    nickname: userProfile.nickname,
    introduce: userProfile.introduce,
    password: "",
    rePassword: "",
  });

  interface ISValidUpdateData {
    [key: string]: boolean | null;
  }

  /** 업데이트 데이터 유효성 여부 */
  const [isValidUpdateData, setIsValidUpdateData] = useState<ISValidUpdateData>({
    nickname: null,
    introduce: null,
    rePassword: null,
  });

  /** 페이지 렌더링과 동시에 updateProfile 업데이트 */
  useEffect(() => {
    setUpdateData({
      nickname: userProfile.nickname,
      introduce: userProfile.introduce,
      password: "",
      rePassword: "",
    });
  }, [isEdit]);

  const editHandler = () => {
    setIsEdit(!isEdit);
  };

  const isSubmitHandler = () => {
    setIsSubmit(!isSubmit);
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
        case "rePassword":
          isValid = passwordValidation(value);
      }

      return { ...prevState, [name]: isValid };
    });
  };

  const submitHanlder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 수정 모드일때만 submit 이벤트 처리
    if (isSubmit) {
      try {
        const res = await UserService.updateProfile(userProfile.userId, updateData, loggedInUser.accessToken);

        if (res === 200) {
          alert("회원정보 수정이 완료되었습니다.");
        }

        setUserProfile((prevState) => {
          return { ...prevState, nickname: updateData.nickname, introduce: updateData.introduce };
        });
        setIsEdit(false);
        setIsSubmit(false);
        setUpdateData((prevState) => {
          return { ...prevState, password: "", rePassword: "" };
        });
      } catch (err: any) {
        let message = "";

        if (err.status === 400) {
          switch (err.data.message) {
            case "invalid_nickname":
              message = "닉네임 형식이 잘못됬습니다.";
              break;
            case "invalid_introduce":
              message = "자기소개 형식이 잘못되었습니다";
              break;
            case "invalid_password":
              message = "비밀번호 형식이 잘못되었습니다.";
              break;
            case "user_not_match":
              message = "사용자 정보가 일치하지 않습니다.";
              break;
            case "password_not_match":
              message = "비밀번호가 일치하지 않습니다.";
              break;
            case "expired_token":
              message = "인증이 만료되었습니다. 다시 로그인 해주세요";
              break;
            default:
              message = "서버 오류입니다. 다시 시도해주세요";
          }
        } else if (err.status === 404) {
          message = "프로필 업데이트에 필요한 정보를 찾을수 없습니다.";
        } else {
          message = "서버 오류입니다. 다시 시도해주세요";
        }

        alert(message);
      }
    }
  };

  const exitHandler = async () => {
    // TODO: prompt -> 모달창으로 변경필요
    const password = window.prompt("비밀번호를 입력해주세요");
    if (!password) {
      alert("올바른 비밀번호를 입력해주세요");
      return;
    }

    const isExit = window.confirm("회원탈퇴시 다시 복구가 불가능합니다. 정말 탈퇴하실껀가요?");
    if (isExit) {
      try {
        await UserService.exit(password, loggedInUser.accessToken);

        setLoggedInuser((prevState) => {
          return { ...prevState, accessToken: "", userId: "", profileImg: "", nickname: "" };
        });
      } catch (err: any) {
        alert("에러발생");
        console.error(err);
      }
    }
  };

  return (
    <StyledProfileInfo>
      <ProfileImage />
      <Form onSubmit={submitHanlder}>
        <FormControl>
          <Label>
            닉네임 - <LabelDesc>커뮤니티를 사용하면서 사용자를 대표하는 이름입니다</LabelDesc>
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
            <Input type="text" name="nickname" value={userProfile.nickname} disabled />
          )}
        </FormControl>
        <FormControl>
          <Label>
            자기소개 - <LabelDesc>커뮤니티에서 나는 어떤사람인지 소개해보세요</LabelDesc>
          </Label>
          {isEdit ? (
            <Input
              type="text"
              name="introduce"
              value={updateData.introduce}
              onChange={updateDataChangeHandler}
              placeholder="자기소개는 최대 30자까지 입력이 가능합니다"
            />
          ) : (
            <Input type="text" name="introduce" value={userProfile.introduce} disabled />
          )}
        </FormControl>
        {loggedInUser.userId === userProfile.userId && (
          <FormControl>
            <Label>
              현재 비밀번호 - <LabelDesc>비밀번호 변경을 희망하는 경우 입력해주세요</LabelDesc>
            </Label>
            {isEdit ? (
              <Input type="password" name="password" value={updateData.password} onChange={updateDataChangeHandler} />
            ) : (
              <Input type="password" name="password" disabled />
            )}
          </FormControl>
        )}
        {loggedInUser.userId === userProfile.userId && (
          <FormControl>
            <Label>
              변경할 비밀번호 - <LabelDesc>변경하고 싶은 비밀번호를 입력해주세요</LabelDesc>
            </Label>
            {isEdit ? (
              <Input
                type="password"
                name="rePassword"
                value={updateData.rePassword}
                onChange={updateDataChangeHandler}
                placeholder="영문, 숫자, 특수문자를 포함하여 10자리 이상 입력해주세요"
              />
            ) : (
              <Input type="password" name="rePassword" disabled />
            )}
          </FormControl>
        )}
        {loggedInUser.userId === userProfile.userId && (
          <>
            {isEdit ? (
              <Buttons>
                <UpdateButton type="submit" onClick={isSubmitHandler}>
                  저장하기
                </UpdateButton>
                <UpdateButton type="button" onClick={editHandler}>
                  취소하기
                </UpdateButton>
              </Buttons>
            ) : (
              <Buttons>
                <UpdateButton type="button" onClick={editHandler}>
                  수정하기
                </UpdateButton>
                <ExitUserButton type="button" onClick={exitHandler}>
                  회원탈퇴
                </ExitUserButton>
              </Buttons>
            )}
          </>
        )}
      </Form>
    </StyledProfileInfo>
  );
};

export default ProfileInfo;

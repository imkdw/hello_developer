import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../recoil/auth.recoil";
import { userProfileState } from "../../recoil/user.recoil";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { UserProfileUpdateData } from "../../types/user";
import { UserService } from "../../services/user";

const StyledProfileInfo = styled.form`
  width: 48%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const ProfileImageWrapper = styled.div`
  width: 100%;
  height: 38%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImageBackground = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  filter: blur(10px);
  position: absolute;
`;

const ProfileImage = styled.img`
  position: relative;
  z-index: 1;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
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
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #a1a1a1;
  padding: 0 10px;
`;

const Div = styled.div`
  height: 50px;
  font-size: 18px;
  border-radius: 10px;
  border: 1px solid #a1a1a1;
  padding: 0 10px;
  display: flex;
  align-items: center;
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
  const loggedInUser = useRecoilValue(loggedInUserState);

  const [updateData, setUpdateData] = useState<UserProfileUpdateData>({
    nickname: userProfile.nickname,
    introduce: userProfile.introduce,
    password: "",
    rePassword: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

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

  // TODO: 사용자 정보 수정시 입력값 검증로직 추가필요
  const submitHanlder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 수정 모드일때만 submit 이벤트 처리
    if (isSubmit) {
      try {
        const { status } = await UserService.updateProfile(userProfile.userId, updateData, loggedInUser.accessToken);

        if (status === 200) {
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
        console.error(err);
        alert("에러발생");
      }
    }
  };

  const updateDataChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    setUpdateData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <StyledProfileInfo onSubmit={submitHanlder}>
      <ProfileImageWrapper>
        <ProfileImageBackground image={userProfile.profileImg} />
        <ProfileImage src={userProfile.profileImg} />
      </ProfileImageWrapper>
      <FormControl>
        <Label>
          닉네임 - <LabelDesc>커뮤니티를 사용하면서 사용자를 대표하는 이름입니다</LabelDesc>
        </Label>
        {isEdit ? (
          <Input type="text" name="nickname" value={updateData.nickname} onChange={updateDataChangeHandler} />
        ) : (
          <Input type="text" value={userProfile.nickname} disabled />
        )}
      </FormControl>
      <FormControl>
        <Label>
          자기소개 - <LabelDesc>커뮤니티에서 나는 어떤사람인지 소개해보세요</LabelDesc>
        </Label>
        {isEdit ? (
          <Input type="text" name="introduce" value={updateData.introduce} onChange={updateDataChangeHandler} />
        ) : (
          <Input type="text" value={userProfile.introduce} disabled />
        )}
      </FormControl>
      <FormControl>
        <Label>
          현재 비밀번호 - <LabelDesc>비밀번호 변경을 희망하는 경우 입력해주세요</LabelDesc>
        </Label>
        {isEdit ? (
          <Input type="password" name="password" value={updateData.password} onChange={updateDataChangeHandler} />
        ) : (
          <Input type="password" disabled />
        )}
      </FormControl>
      <FormControl>
        <Label>
          변경할 비밀번호 - <LabelDesc>변경하고 싶은 비밀번호를 입력해주세요</LabelDesc>
        </Label>
        {isEdit ? (
          <Input type="password" name="rePassword" value={updateData.rePassword} onChange={updateDataChangeHandler} />
        ) : (
          <Input type="password" disabled />
        )}
      </FormControl>
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
              <ExitUserButton type="button">회원탈퇴</ExitUserButton>
            </Buttons>
          )}
        </>
      )}
    </StyledProfileInfo>
  );
};

export default ProfileInfo;

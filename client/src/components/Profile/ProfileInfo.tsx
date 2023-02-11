import styled from "styled-components";

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
  height: 40%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImageBackground = styled.div`
  width: 100%;
  height: 100%;
  background-image: url("data:image/png;base64,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");
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

const Buttons = styled.div`
  width: auto;
  height: 50px;
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const SaveButton = styled.button`
  font-size: 18px;
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
  return (
    <StyledProfileInfo>
      <ProfileImageWrapper>
        <ProfileImageBackground />
        <ProfileImage src="data:image/png;base64,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" />
      </ProfileImageWrapper>
      <FormControl>
        <Label>
          닉네임 - <LabelDesc>커뮤니티를 사용하면서 사용자를 대표하는 이름입니다</LabelDesc>
        </Label>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <Label>
          자기소개 - <LabelDesc>커뮤니티에서 나는 어떤사람인지 소개해보세요</LabelDesc>
        </Label>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <Label>
          현재 비밀번호 - <LabelDesc>비밀번호 변경을 희망하는 경우 입력해주세요</LabelDesc>
        </Label>
        <Input type="password" />
      </FormControl>
      <FormControl>
        <Label>
          변경할 비밀번호 - <LabelDesc>변경하고 싶은 비밀번호를 입력해주세요</LabelDesc>
        </Label>
        <Input type="password" />
      </FormControl>
      <Buttons>
        <SaveButton type="submit">저장</SaveButton>
        <ExitUserButton type="button">회원탈퇴</ExitUserButton>
      </Buttons>
    </StyledProfileInfo>
  );
};

export default ProfileInfo;
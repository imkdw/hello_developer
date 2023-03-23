import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { useRef, ChangeEvent, FormEvent, useState, useEffect } from "react";
import { userInfoState } from "../../recoil/user";
import { loggedInUserState } from "../../recoil";
import { updateProfileImage } from "../../services/UserService";

const StyledUserProfileImage = styled.form`
  width: 100%;
  height: 38%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageBackground = styled.div<{ image: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  filter: blur(10px);
  position: absolute;
`;

const Image = styled.img`
  position: relative;
  z-index: 1;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const ImageChangeButton = styled.button`
  position: absolute;
  bottom: 20px;
  font-size: 20px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  padding: 0 10px;
  border-radius: 10px;
`;

interface UserProfileImageProps {
  userId: string;
}

const UserProfileImage = ({ userId }: UserProfileImageProps) => {
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [loggedInUser, setLoggedInuser] = useRecoilState(loggedInUserState);
  const fileUploadRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const inputClickHandler = () => {
    fileUploadRef.current?.click();
  };

  const imageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;

    if (files) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        setUserInfo((prevState) => {
          return { ...prevState, profileImg: e.target?.result as string };
        });
      };
      reader.readAsDataURL(files[0]);

      /** 실제 이미지 업로드 요청 */
      submitHandler(event as unknown as FormEvent<HTMLFormElement>, files[0]);
    }
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>, image: File) => {
    event.preventDefault();

    if (!image) {
      alert("이미지 등록에 실패했습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await updateProfileImage(userId, formData, loggedInUser.accessToken);

      localStorage.setItem("profileImg", res.data.profileImg);

      setLoggedInuser((prevState) => {
        return { ...prevState, profileImg: res.data.profileImg };
      });
    } catch (err: any) {
      alert("에러발생");
      console.error(err);
    }
  };

  return (
    <StyledUserProfileImage encType="multipart/form-data" acceptCharset="UTF-8" ref={formRef}>
      <input type="file" name="image" hidden ref={fileUploadRef} accept="image/*" onChange={imageChangeHandler} />
      <ImageBackground image={userInfo.profileImg} />
      <Image src={userInfo.profileImg} />
      {loggedInUser.userId === userId && (
        <ImageChangeButton onClick={inputClickHandler} type="button">
          사진변경
        </ImageChangeButton>
      )}
    </StyledUserProfileImage>
  );
};

export default UserProfileImage;

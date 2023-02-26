import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import { userProfileState } from "../../recoil/user.recoil";
import { UserService } from "../../services/user";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import ProfileData from "./ProfileData";

const StyledProfile = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Profile = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);
  const userId = useParams().userId;
  const setUserProfile = useSetRecoilState(userProfileState);

  useEffect(() => {
    const getProfile = async () => {
      if (!userId) {
        alert("존재하지 않는 사용자 입니다.");
        return;
      }

      try {
        const { status, user } = await UserService.profile(userId);

        if (status === 200) {
          setUserProfile(user);
        }
      } catch (err: any) {
        let message = "";

        if (err.status === 404) {
          message = "사용자 정보를 찾을수 없습니다.";
        } else {
          message = "서버 오류입니다. 다시 시도해주세요";
        }

        alert(message);
      }
    };

    if (userId) {
      getProfile();
    }
  }, [userId]);

  return (
    <StyledProfile>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <ProfileData />
    </StyledProfile>
  );
};

export default Profile;

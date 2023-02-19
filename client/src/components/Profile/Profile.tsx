import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { enableSideMenuState } from "../../recoil/ui.recoil";
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
  // const userId = useParams().userId;

  return (
    <StyledProfile>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <ProfileData />
    </StyledProfile>
  );
};

export default Profile;

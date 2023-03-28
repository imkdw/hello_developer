import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/Mobile";
import { Profile } from "../../components/Profile";
import { enableMenuState } from "../../recoil";

const StyledProfilePage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const ProfilePage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableMenuState);

  return (
    <StyledProfilePage>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableSideMenu && <Menu />}
      <Profile />
    </StyledProfilePage>
  );
};

export default ProfilePage;

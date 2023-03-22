import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { Profile } from "../../components/Profile";

const StyledProfilePage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ProfilePage = () => {
  return (
    <StyledProfilePage>
      <Menu />
      <Profile />
    </StyledProfilePage>
  );
};

export default ProfilePage;

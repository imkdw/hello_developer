import styled from "styled-components";
import ProfileHistory from "./ProfileHistory";
import ProfileInfo from "./ProfileInfo";

const StyledProfileData = styled.div`
  flex: 6;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 95%;
  height: 95%;
  display: flex;
  justify-content: space-between;
`;

const ProfileData = () => {
  return (
    <StyledProfileData>
      <Wrapper>
        <ProfileInfo />
        <ProfileHistory />
      </Wrapper>
    </StyledProfileData>
  );
};

export default ProfileData;

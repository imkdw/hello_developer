import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { loggedInUserState } from "../../../recoil";

const StyledProfile = styled(Link)`
  width: 50px;
  height: 50px;
`;

const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #dbdbdb;
`;

const ProfileImage = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  return (
    <StyledProfile to={`/users/${loggedInUser.userId}`}>
      <ProfileImg src={loggedInUser.profileImg} />
    </StyledProfile>
  );
};

export default ProfileImage;

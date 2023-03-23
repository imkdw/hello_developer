import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { getProfile } from "../../services";
import UserInfo from "./UserInfo";
import UserHistory from "./UserHistory";

const StyledProfile = styled.div`
  flex: 6;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Profile = () => {
  const userId = useParams().userId as string;

  useEffect(() => {}, []);

  return (
    <StyledProfile>
      <UserInfo userId={userId} />
      <UserHistory userId={userId} />
    </StyledProfile>
  );
};

export default Profile;

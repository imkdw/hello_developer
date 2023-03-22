import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import { getProfile } from "../../services";
import UserInfo from "./UserInfo";
import UserHistory from "./UserHistory";

const StyledProfile = styled.div`
  flex: 6;
  height: 100%;
`;

const Profile = () => {
  const userId = useParams().userId as string;

  useEffect(() => {
    const loadProfile = async () => {
      const res = await getProfile(userId);
      console.log(res.data);
    };

    if (userId) {
      loadProfile();
    }
  }, []);

  return (
    <StyledProfile>
      <UserInfo />
      <UserHistory />
    </StyledProfile>
  );
};

export default Profile;

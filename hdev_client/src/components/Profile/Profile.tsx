import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useEffect } from "react";
import UserInfo from "./UserInfo";
import UserHistory from "./UserHistory";
import { useSetRecoilState } from "recoil";
import { enableMenuState } from "../../recoil";

const StyledProfile = styled.div`
  flex: 6;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;

  @media screen and (max-width: 767px) {
    height: auto;
    gap: 20px;
    margin-top: 20px;
    flex-direction: column;
  }
`;

const Profile = () => {
  const userId = useParams().userId as string;
  const setEnableMenu = useSetRecoilState(enableMenuState);

  useEffect(() => {
    setEnableMenu(false);
    document.body.style.overflow = "scroll";
  }, [setEnableMenu]);

  return (
    <StyledProfile>
      <UserInfo userId={userId} />
      <UserHistory userId={userId} />
    </StyledProfile>
  );
};

export default Profile;

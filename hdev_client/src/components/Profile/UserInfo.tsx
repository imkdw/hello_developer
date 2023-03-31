import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { getProfile } from "../../services";
import { loggedInUserState } from "../../recoil";
import { userInfoState } from "../../recoil/user";
import UserProfileImage from "./UserProfileImage";
import UpdateProfile from "./Update/UpdateProfile";
import UpdatePassword from "./Update/UpdatePassword";
import ExitUser from "./ExitUser";
import { useNavigate } from "react-router-dom";

const StyledUserInfo = styled.div`
  width: 45%;
  height: 90%;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 767px) {
    width: 90%;
    height: 650px;
  }
`;

const HistoryTab = styled.div`
  width: 100%;
  height: 8%;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  justify-content: space-around;

  @media screen and (max-width: 767px) {
    height: 10%;
  }
`;

const TabItem = styled.button<{ $isBorder: boolean }>`
  font-size: 20px;
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: ${(props) => (props.$isBorder ? "2px solid #0090f9" : "")};

  &:hover {
    border-bottom: 2px solid #0090f9;
  }

  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`;

interface UserInfoProps {
  userId: string;
}

const UserInfo = ({ userId }: UserInfoProps) => {
  const setUserInfo = useSetRecoilState(userInfoState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();

  const [enableTab, setEnableTag] = useState({
    profile: true,
    password: false,
    exit: false,
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile(userId);
        setUserInfo(res.data);
      } catch (err: any) {
        if (err.response.status === 404) {
          navigator("/404");
        }
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId, setUserInfo]);

  const changeTagHandler = (item: "profile" | "password" | "exit") => {
    setEnableTag({ profile: item === "profile", password: item === "password", exit: item === "exit" });
  };

  return (
    <StyledUserInfo>
      <UserProfileImage userId={userId} />
      <HistoryTab>
        <TabItem onClick={() => changeTagHandler("profile")} $isBorder={enableTab.profile}>
          회원정보
        </TabItem>
        <TabItem
          onClick={() => {
            changeTagHandler("password");
          }}
          $isBorder={enableTab.password}
          disabled={userId !== loggedInUser.userId}
        >
          비밀번호 변경
        </TabItem>
        <TabItem
          onClick={() => {
            changeTagHandler("exit");
          }}
          $isBorder={enableTab.exit}
          disabled={userId !== loggedInUser.userId}
        >
          회원탈퇴
        </TabItem>
      </HistoryTab>
      {enableTab.profile && <UpdateProfile userId={userId} />}
      {enableTab.password && <UpdatePassword userId={userId} />}
      {enableTab.exit && <ExitUser userId={userId} />}
    </StyledUserInfo>
  );
};

export default UserInfo;

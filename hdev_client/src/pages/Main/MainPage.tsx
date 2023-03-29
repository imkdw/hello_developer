import styled from "styled-components";
import { Menu } from "../../components/Menu";
import { RecentBoard } from "../../components/RecentBoard";
import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import { enableMenuState } from "../../recoil";
import MobileHeader from "../../components/Mobile/Header/MobileHeader";
import axios from "axios";

const StyledMain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    height: auto;
    flex-direction: column;
    gap: 20px;
  }
`;

const MainPage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableMenuState);

  const test = async () => {
    const res = await axios.get("http://localhost:5000/auth/test", {
      withCredentials: true,
    });
    console.log(res.data);
  };

  return (
    <StyledMain>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableSideMenu && <Menu />}
      <RecentBoard />
      <button onClick={test}>1</button>
    </StyledMain>
  );
};

export default MainPage;

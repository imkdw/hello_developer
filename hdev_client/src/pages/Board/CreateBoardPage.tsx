import styled from "styled-components";
import CreateBoardForm from "../../components/Board/CreateBoard/CreateBoardForm";
import { Menu } from "../../components/Menu";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { enableMenuState, loggedInUserState } from "../../recoil";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useMediaQuery } from "react-responsive";
import { MobileHeader } from "../../components/Mobile";

const StyledCreateBoardPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const CreateBoardPage = () => {
  const tempBoardId = v4();
  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableMenuState);

  useEffect(() => {
    if (!loggedInUser.accessToken) {
      alert("로그인이 필요한 서비스 입니다.");
      navigator("/login");
    }
  }, [navigator, loggedInUser.accessToken]);

  return (
    <StyledCreateBoardPage>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableSideMenu && <Menu />}
      <CreateBoardForm tempBoardId={tempBoardId} />
    </StyledCreateBoardPage>
  );
};
export default CreateBoardPage;

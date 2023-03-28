import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { UpdateBoardForm } from "../../components/Board/UpdateBoard";
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/Mobile";
import { enableMenuState } from "../../recoil";

const StyledUpdateBoardPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const UpdateBoardPage = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableMenuState);
  return (
    <StyledUpdateBoardPage>
      {isMobile && <MobileHeader />}
      {!isMobile && <Menu />}
      {enableSideMenu && <Menu />}
      <UpdateBoardForm />
    </StyledUpdateBoardPage>
  );
};

export default UpdateBoardPage;

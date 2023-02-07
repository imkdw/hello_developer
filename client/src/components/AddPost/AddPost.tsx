import { useMediaQuery } from "react-responsive";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { enableSideMenuState } from "../../recoil/ui.recoil";
import { MobileHeader } from "../Common";
import { SideMenu } from "../SideMenu";
import AddPostForm from "./AddPostForm";

const StyledAddPost = styled.div`
  width: 100%;
  height: 100%;
  display: flex;

  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const AddPost = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  const enableSideMenu = useRecoilValue(enableSideMenuState);

  return (
    <StyledAddPost>
      {enableSideMenu && <SideMenu />}
      {isMobile ? <MobileHeader /> : <SideMenu />}
      <AddPostForm />
    </StyledAddPost>
  );
};

export default AddPost;

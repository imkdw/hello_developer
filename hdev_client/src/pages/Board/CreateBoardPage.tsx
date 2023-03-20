import styled from "styled-components";
import CreateBoardForm from "../../components/Board/CreateBoard/CreateBoardForm";
import { Menu } from "../../components/Menu";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { loggedInUserState } from "../../recoil";
import { useNavigate } from "react-router-dom";

const StyledCreateBoardPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const CreateBoardPage = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const navigator = useNavigate();

  useEffect(() => {
    if (!loggedInUser.accessToken) {
      alert("로그인이 필요한 서비스 입니다.");
      navigator("/login");
    }
  }, []);

  return (
    <StyledCreateBoardPage>
      <Menu />
      <CreateBoardForm />
    </StyledCreateBoardPage>
  );
};
export default CreateBoardPage;

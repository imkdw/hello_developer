import styled from "styled-components";
import { UpdateBoardForm } from "../../components/Board/UpdateBoard";
import { Menu } from "../../components/Menu";

const StyledUpdateBoardPage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const UpdateBoardPage = () => {
  return (
    <StyledUpdateBoardPage>
      <Menu />
      <UpdateBoardForm />
    </StyledUpdateBoardPage>
  );
};

export default UpdateBoardPage;

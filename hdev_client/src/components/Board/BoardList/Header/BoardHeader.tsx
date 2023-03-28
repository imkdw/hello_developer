import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AddIcon } from "../../../../assets/icon";
import CategoryTab from "./CategoryTab";
import Subject from "./Subject";

const StyledBoardHeader = styled.div`
  width: 100%;
  min-height: 140px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const CreateButton = styled(Link)`
  width: 170px;
  height: 40px;
  border-radius: 10px;
  position: absolute;
  background-color: #0064fe;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  right: 20px;
  top: 100px;
  transform: translateY(-50%);
`;

const ButtonText = styled.p`
  color: white;
  font-size: 17px;
  margin-bottom: 3px;
`;

const BoardHeader = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });

  return (
    <StyledBoardHeader>
      <Subject />
      <CategoryTab />
      {!isMobile && (
        <CreateButton to="/boards/add">
          <AddIcon />
          <ButtonText>새로운 글 작성</ButtonText>
        </CreateButton>
      )}
    </StyledBoardHeader>
  );
};

export default BoardHeader;

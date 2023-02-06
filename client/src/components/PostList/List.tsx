import styled from "styled-components";
import ListItem from "./ListItem";

const StyledList = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 30px;
  overflow: auto;

  @media screen and (max-width: 767px) {
    justify-content: center;
  }
`;

const List = () => {
  return (
    <StyledList>
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
    </StyledList>
  );
};

export default List;

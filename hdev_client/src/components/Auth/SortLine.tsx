import styled from "styled-components";

const StyledSortLine = styled.div`
  width: 95%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c3c3c3;
`;

const Line = styled.div`
  width: 45%;
  height: 2px;
  background-color: #dedede;
`;

const SortLine = () => {
  return (
    <StyledSortLine>
      <Line />
      OR
      <Line />
    </StyledSortLine>
  );
};
export default SortLine;

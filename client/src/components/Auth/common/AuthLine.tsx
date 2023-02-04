import styled from "styled-components";

const StyledAuthLine = styled.div`
  width: 95%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #c3c3c3;
  margin-top: 30px;
`;

const Line = styled.div`
  width: 45%;
  height: 2px;
  background-color: #dedede;
`;

const AuthLine = () => {
  return (
    <StyledAuthLine>
      <Line />
      OR
      <Line />
    </StyledAuthLine>
  );
};
export default AuthLine;

import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MobileHeader } from "../../components/Mobile";

const StyledNotFound = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  justify-content: center;

  @media screen and (max-width: 767px) {
    justify-content: flex-start;
  }
`;

const Title = styled.h1`
  font-size: 50px;

  @media screen and (max-width: 767px) {
    font-size: 28px;
  }
`;

const HomeButton = styled(Link)`
  width: 180px;
  height: 50px;
  display: flex;
  justify-content: space-around;
  font-size: 30px;
  background-color: #0090f9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  @media screen and (max-width: 767px) {
    width: 130px;
    height: 40px;
    font-size: 20px;
  }
`;

const NotFound = () => {
  const isMobile = useMediaQuery({ maxWidth: "767px" });
  return (
    <StyledNotFound>
      {isMobile && <MobileHeader />}
      <Title>존재하지 않는 페이지 입니다.</Title>
      <HomeButton to="/">메인으로</HomeButton>
    </StyledNotFound>
  );
};
export default NotFound;

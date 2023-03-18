import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLogo = styled(Link)<{ width: string; height: string }>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const StyledLogoImg = styled.img`
  width: 100%;
  height: 100%;
`;

interface LogoProps {
  width: number;
  height: number;
}
const Logo = ({ width, height }: LogoProps) => {
  return (
    <StyledLogo to="/main" width={width + "px"} height={height + "px"}>
      <StyledLogoImg src={process.env.PUBLIC_URL + "/img/logo.svg"} />
    </StyledLogo>
  );
};

export default Logo;

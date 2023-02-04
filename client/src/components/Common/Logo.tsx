import styled from "styled-components";

import logoImage from "../../assets/images/logo.svg";

const StyledLogo = styled.img<{ width: string; height: string }>``;

interface LogoProps {
  width: number;
  height: number;
}
const Logo = ({ width, height }: LogoProps) => {
  return <StyledLogo width={width + "px"} height={height + "px"} src={logoImage} />;
};

export default Logo;

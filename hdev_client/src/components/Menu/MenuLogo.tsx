import styled from "styled-components";
import { Logo } from "../Common";

const SideMenuLogo = styled.div`
  width: 100%;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e5e6e8;
`;
const MenuLogo = () => {
  return (
    <SideMenuLogo>
      <Logo width={200} height={70} />
    </SideMenuLogo>
  );
};

export default MenuLogo;

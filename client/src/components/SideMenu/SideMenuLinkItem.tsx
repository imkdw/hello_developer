import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledSideMenuLinkItem = styled.li`
  width: 100%;
  height: 45px;
  border-radius: 10px;

  &:hover {
    background-color: #e7e9eb;
  }
`;

const LinkItem = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkText = styled.p`
  font-size: 20px;
  color: #767e8c;
`;

interface LinkItemProps {
  Icon: any;
  to: string;
  text: string;
}

const SideMenuLinkItem = ({ Icon, to, text }: LinkItemProps) => {
  return (
    <StyledSideMenuLinkItem>
      <LinkItem to={to}>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        <LinkText>{text}</LinkText>
      </LinkItem>
    </StyledSideMenuLinkItem>
  );
};

export default SideMenuLinkItem;

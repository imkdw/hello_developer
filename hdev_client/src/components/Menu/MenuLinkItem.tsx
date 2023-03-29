import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledMenuLinkItem = styled.li<{ backgroundColor?: boolean }>`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor && "#e7e9eb"};

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

  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;

interface LinkItemProps {
  Icon: any;
  to: string;
  text: string;
}

const MenuLinkItem = ({ Icon, to, text }: LinkItemProps) => {
  return (
    <StyledMenuLinkItem>
      <LinkItem to={to}>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        <LinkText>{text}</LinkText>
      </LinkItem>
    </StyledMenuLinkItem>
  );
};

export default MenuLinkItem;

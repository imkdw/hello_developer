import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPageState } from "../../recoil/ui.recoil";

const StyledSideMenuLinkItem = styled.li<{ backgroundColor?: boolean }>`
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
  onClick?: () => void;
}

const SideMenuLinkItem = ({ Icon, to, text, onClick }: LinkItemProps) => {
  const currentPage = useRecoilValue(currentPageState);

  /** 접속중인 페이지와 선택한 페이지가 같은지 확인하는 함수 */
  const isCurrentPage = (text: string) => {
    interface IPageList {
      [key: string]: string;
    }

    const pageList: IPageList = {
      notice: "공지사항",
      suggestion: "건의사항",
      free: "자유주제",
      knowledge: "지식공유",
      qna: "질문답변",
      recruitment: "인원모집",
    };

    if (pageList[currentPage] === text) {
      return true;
    }

    return false;
  };

  return (
    <StyledSideMenuLinkItem onClick={onClick} backgroundColor={isCurrentPage(text)}>
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

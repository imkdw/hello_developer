import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPageState } from "../../recoil/ui.recoil";

const StyledUtils = styled.div`
  width: 100%;
  min-height: 100px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  align-items: center;

  @media screen and (max-width: 767px) {
    width: 90%;
    min-height: 60px;
    align-items: center;
    position: relative;
  }
`;

const Search = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const SearchIcon = () => {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.6 1.8C6.97268 1.8 2.40002 6.37266 2.40002 12C2.40002 17.6273 6.97268 22.2 12.6 22.2C14.8266 22.2 16.8844 21.4828 18.5625 20.2687L26.4563 28.1438L28.1438 26.4563L20.3438 18.6375C21.8766 16.8516 22.8 14.5336 22.8 12C22.8 6.37266 18.2274 1.8 12.6 1.8ZM12.6 3C17.5782 3 21.6 7.02187 21.6 12C21.6 16.9781 17.5782 21 12.6 21C7.6219 21 3.60002 16.9781 3.60002 12C3.60002 7.02187 7.6219 3 12.6 3Z"
        fill="#ABABAB"
      />
    </svg>
  );
};

const Input = styled.input`
  width: 90%;
  height: 50%;
  font-size: 20px;
`;

const Sort = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SortButton = styled.button`
  width: 150px;
  height: 40px;
  border: 1px solid #e5e6e8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const SortButtonText = styled.p`
  font-size: 16px;
  color: #303d51;
  margin-bottom: 3px;
`;

const MobileUtilButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid #e5e6e8;
`;

const MobileAddPostButton = styled(Link)`
  width: 80px;
  height: 40px;
  border-radius: 10px;
  position: absolute;
  background-color: #0064fe;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 16px;
`;

const SortIcon = () => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_16_1562)">
        <path
          d="M10.1563 21.875C10.01 21.8755 9.86652 21.8349 9.74219 21.7578C9.62961 21.6874 9.53681 21.5895 9.47256 21.4734C9.40832 21.3572 9.37474 21.2265 9.37501 21.0938V13.5781L3.34376 6.88281C2.69827 6.16408 2.342 5.23166 2.34376 4.26562V3.90625C2.34376 3.69905 2.42607 3.50034 2.57258 3.35382C2.71909 3.20731 2.91781 3.125 3.12501 3.125H21.875C22.0822 3.125 22.2809 3.20731 22.4274 3.35382C22.5739 3.50034 22.6563 3.69905 22.6563 3.90625V4.26562C22.658 5.23166 22.3017 6.16408 21.6563 6.88281L15.625 13.5781V17.7812C15.6259 18.2175 15.5049 18.6454 15.2758 19.0167C15.0467 19.388 14.7185 19.6879 14.3281 19.8828L10.5078 21.7891C10.399 21.8448 10.2786 21.8743 10.1563 21.875ZM3.94532 4.6875C4.02274 5.11505 4.21749 5.51267 4.50782 5.83594L10.7578 12.7578C10.8796 12.9045 10.9435 13.0907 10.9375 13.2812V19.8281L13.6328 18.4844C13.7628 18.4189 13.872 18.3183 13.9479 18.1941C14.0238 18.0698 14.0635 17.9268 14.0625 17.7812V13.2812C14.063 13.0876 14.1354 12.9011 14.2656 12.7578L20.5156 5.83594C20.8116 5.5145 21.0119 5.11672 21.0938 4.6875H3.94532Z"
          fill="#89909C"
        />
      </g>
      <defs>
        <clipPath id="clip0_16_1562">
          <rect width="25" height="25" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const currentPageText = (currentPage: string): string => {
  switch (currentPage) {
    case "notice":
      return "공지사항";
    case "suggestion":
      return "건의사항";
    case "free":
      return "자유주제";
    case "knowledge":
      return "지식공유";
    case "qna":
      return "질문답변";
    case "recruitment":
      return "인원모집";
    default:
      return "";
  }
};

const Utils = () => {
  const currentPage = useRecoilValue(currentPageState);
  const isMobile = useMediaQuery({ maxWidth: "767px" });

  return (
    <StyledUtils>
      {isMobile ? (
        <>
          <MobileUtilButton>
            <SearchIcon />
          </MobileUtilButton>
          <MobileUtilButton>
            <SortIcon />
          </MobileUtilButton>
          <MobileAddPostButton to="/post/add">글작성</MobileAddPostButton>
        </>
      ) : (
        <>
          <Search>
            <SearchIcon />
            <Input placeholder={currentPageText(currentPage) + "에서 검색해보세요!"} />
          </Search>
          <Sort>
            <SortButton>
              <SortIcon />
              <SortButtonText>정렬 : 작성일순</SortButtonText>
            </SortButton>
          </Sort>
        </>
      )}
    </StyledUtils>
  );
};

export default Utils;

import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPageState } from "../../recoil/ui.recoil";

const StyledHeader = styled.header`
  width: 100%;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e5e6e8;

  @media screen and (max-width: 767px) {
    border: none;
  }
`;

const Top = styled.div`
  width: 90%;
  height: 70px;
  display: flex;
  gap: 10px;
  align-items: flex-end;

  @media screen and (max-width: 767px) {
    height: 60%;
    gap: 5px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }
`;

const Title = styled.div`
  font-size: 30px;

  @media screen and (max-width: 767px) {
    font-size: 27px;
  }
`;

const SubTitle = styled.p`
  font-size: 16px;
  margin-bottom: 4px;

  @media screen and (max-width: 767px) {
    font-size: 15px;
  }
`;

const Bottom = styled.div`
  width: 94%;
  height: 70px;
  display: flex;
  align-items: flex-end;
  position: relative;

  @media screen and (max-width: 767px) {
    width: 100%;
    height: 40%;
  }
`;

const CategoryTab = styled.div`
  width: 70%;
  height: 50px;
  display: flex;
  gap: 10px;

  @media screen and (max-width: 767px) {
    width: 100%;
    justify-content: center;
  }
`;

const CategoryItem = styled(Link)<{ $isBorderBottom: boolean }>`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${(props) => props.$isBorderBottom && "2px solid #0064fe"};

  &:hover {
    border-bottom: 2px solid #0064fe;
  }

  @media screen and (max-width: 767px) {
    width: 20%;
  }
`;

const AddPostButton = styled(Link)`
  width: 170px;
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

  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const ButtonText = styled.p`
  color: white;
  font-size: 17px;
  margin-bottom: 3px;
`;

const AddIcon = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 7V25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16H25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const PostDataHeader = () => {
  const currentPage = useRecoilValue(currentPageState);
  const currentPathname = useLocation().pathname;

  interface PageData {
    [key: string]: {
      title: string;
      subTitle: string;
      link: string;
      category?: {
        text: string;
        link: string;
      }[];
    };
  }

  /** 페이지 카테고리 */
  const pageData: PageData = {
    notice: {
      title: "공지사항",
      subTitle: "헬로디벨로퍼의 중요한 공지사항이 업로드되는 공간",
      link: "/notice",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    suggestion: {
      title: "건의사항",
      subTitle: "헬로디벨로퍼에 관한 요구사항을 건의하는 공간",
      link: "/suggestion",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    free: {
      title: "자유주제",
      subTitle: "자유로운 주제로 유저들과 소통하는 공간",
      link: "/free",
      category: [
        {
          text: "전체",
          link: "",
        },
      ],
    },
    knowledge: {
      title: "지식공유",
      subTitle: "개발과 관련된 각종 지식을을 함께 나누는 공간",
      link: "/knowledge",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "꿀팁",
          link: "/tips",
        },
        {
          text: "리뷰",
          link: "/review",
        },
      ],
    },
    qna: {
      title: "질문답변",
      subTitle: "개발하면서 궁금한 내용을 질문하고 답변하는 공간",
      link: "/qna",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "기술",
          link: "/tech",
        },
        {
          text: "커리어",
          link: "/career",
        },
      ],
    },
    recruitment: {
      title: "인원모집",
      subTitle: "다양한 주제로 개발자분들을 모집하는 공간",
      link: "/recruitment",
      category: [
        {
          text: "전체",
          link: "",
        },
        {
          text: "프로젝트",
          link: "/project",
        },
        {
          text: "스터디",
          link: "/study",
        },
        {
          text: "채용공고",
          link: "/company",
        },
      ],
    },
  };

  return (
    <StyledHeader>
      {currentPage && currentPage !== "main" && (
        <>
          <Top>
            <Title>{pageData[currentPage].title}</Title>
            <SubTitle>{pageData[currentPage].subTitle}</SubTitle>
          </Top>
          <Bottom>
            <CategoryTab>
              {pageData[currentPage].category?.map((category) => {
                const linkTo = pageData[currentPage].link + category.link;
                const isBorderBottom = currentPathname === linkTo;

                return (
                  <CategoryItem to={linkTo} $isBorderBottom={isBorderBottom} key={category.link}>
                    {category.text}
                  </CategoryItem>
                );
              })}
            </CategoryTab>
            <AddPostButton to="/post/add">
              <AddIcon />
              <ButtonText>새로운 글 작성</ButtonText>
            </AddPostButton>
          </Bottom>
        </>
      )}
    </StyledHeader>
  );
};

export default PostDataHeader;

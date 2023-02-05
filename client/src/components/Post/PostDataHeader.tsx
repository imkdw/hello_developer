import { Link, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { currentPageState } from "../../recoil/ui.recoil";

const StyledPostDataHeader = styled.header`
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #e5e6e8;
`;

const Top = styled.div`
  width: 90%;
  height: 50%;
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const Title = styled.div`
  font-size: 30px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  margin-bottom: 4px;
`;

const Bottom = styled.div`
  width: 94%;
  height: 50%;
  display: flex;
  align-items: flex-end;
`;

const CategoryTab = styled.div`
  width: 70%;
  height: 50px;
  display: flex;
  gap: 10px;
`;

const CategoryItem = styled(Link)<{ borderBottom: boolean }>`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${(props) => props.borderBottom && "2px solid #0064fe"};

  &:hover {
    border-bottom: 2px solid #0064fe;
  }
`;

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
          text: "기술",
          link: "/tech",
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
    <StyledPostDataHeader>
      {currentPage && (
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
                  <CategoryItem to={linkTo} borderBottom={isBorderBottom}>
                    {category.text}
                  </CategoryItem>
                );
              })}
            </CategoryTab>
          </Bottom>
        </>
      )}
    </StyledPostDataHeader>
  );
};

export default PostDataHeader;

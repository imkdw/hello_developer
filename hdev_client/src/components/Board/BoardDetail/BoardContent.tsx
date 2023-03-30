import { useRecoilState, useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { RecommendIcon } from "../../../assets/icon";
import { loggedInUserState } from "../../../recoil";
import { boardDetailState } from "../../../recoil/board";
import { addRecommend, getBoard } from "../../../services/BoardService";
import { MarkdownViewer } from "../../Common";

const StyledBoardContent = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Title = styled.h1`
  font-size: 40px;
`;

const TagsAndRecommend = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Tags = styled.div`
  height: 40px;
  display: flex;
  gap: 10px;
`;

const TagText = styled.p`
  width: auto;
  height: 100%;
  background-color: #f3f4f6;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 10px;
`;

const Recommend = styled.button<{ isBackgroundColor: boolean }>`
  width: auto;
  padding: 5px 15px 5px 15px;
  display: flex;
  border: 1px solid #b9b9b9;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 16px;
  background-color: ${(props) => props.isBackgroundColor && "#e9e9e9"};

  @media screen and (max-width: 767px) {
    padding: 5px 10px 5px 10px;
  }

  &:hover {
    background-color: #dfdfdf;
  }
`;

const BoardContent = () => {
  const [boardDetail, setBoardDetail] = useRecoilState(boardDetailState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [isRecommendedUser, setIsRecommendedUser] = useState(false);

  useEffect(() => {
    setIsRecommendedUser(boardDetail.recommends.some((recommend) => recommend.userId === loggedInUser.userId));
  }, [boardDetail.recommends, loggedInUser.userId]);

  const recommendHandler = async () => {
    if (!loggedInUser.accessToken) {
      alert("로그인이 필요한 서비스 입니다.");
      return;
    }

    try {
      const res = await addRecommend(boardDetail.boardId, loggedInUser.accessToken);

      if (res.data.accessToken) {
        setLoggedInUser((prevState) => {
          return { ...prevState, accessToken: res.data.accessToken };
        });
      }

      const boardRes = await getBoard(boardDetail.boardId);
      setBoardDetail(boardRes.data);
      setIsRecommendedUser((prevState) => !prevState);
    } catch (err: any) {
      let errMessage = "서버 오류입니다. 다시 시도해주세요.";
      if (err.status.response === 401) {
        errMessage = "인증이 만료되었습니다. 다시 로그인해주세요";
      }
      alert(errMessage);
    }
  };

  return (
    <StyledBoardContent>
      <Title>제목 : {boardDetail.title}</Title>
      <MarkdownViewer content={boardDetail.content} />
      <TagsAndRecommend>
        <Tags>
          {boardDetail.tags.map((tag) => {
            if (tag.name.length !== 0) {
              return <TagText key={tag.name}># {tag.name}</TagText>;
            }

            return null;
          })}
        </Tags>
        <Recommend onClick={recommendHandler} isBackgroundColor={isRecommendedUser}>
          <RecommendIcon />
          {boardDetail.recommendCnt}
        </Recommend>
      </TagsAndRecommend>
    </StyledBoardContent>
  );
};
export default BoardContent;

import { useState } from "react";
import styled from "styled-components";

const StyledProfileHistory = styled.div`
  width: 48%;
  height: 100%;
  border-radius: 10px;
  border: 1px solid #d4d4d4;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HistoryTab = styled.div`
  width: 95%;
  height: 8%;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  justify-content: space-between;
`;

const TabItem = styled.div`
  font-size: 20px;
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    border-bottom: 2px solid #0090f9;
  }

  &:first-child {
    border-bottom: 2px solid #0090f9;
  }
`;

const History = styled.ul`
  width: 93%;
  height: 92%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HistoryItem = styled.li`
  width: 100%;
  height: 120px;
  border-bottom: 1px solid #e5e6e8;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  cursor: pointer;

  &:first-child {
    margin-top: 10px;
  }

  &:hover {
    background-color: #e7e9eb;
  }
`;

const HistoryCategory = styled.div`
  font-size: 20px;
  width: 100%;
`;

const CategoryText = styled.span`
  font-size: 22px;
  color: #0090f9;
`;

const HistoryData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const PostTitle = styled.div`
  font-size: 20px;
`;

const PostCreatedAt = styled.div`
  font-size: 20px;
  color: #7d7d7d;
`;

const ProfileHistory = () => {
  const [posts, setPosts] = useState();

  const historyHandler = (item: string) => {};

  return (
    <StyledProfileHistory>
      <HistoryTab>
        <TabItem onClick={() => historyHandler("post")}>작성한 글</TabItem>
        <TabItem onClick={() => historyHandler("comment")}>작성한 댓글</TabItem>
        <TabItem onClick={() => historyHandler("bookmark")}>저장한 글</TabItem>
      </HistoryTab>
      <History>
        {[1, 2, 3, 4, 5].map((number) => (
          <HistoryItem key={number}>
            <HistoryCategory>
              카테고리 : <CategoryText>지식공유 - 기술</CategoryText>
            </HistoryCategory>
            <HistoryData>
              <PostTitle>테스트 게시물{number} 의 제목 입니다아아.</PostTitle>
              <PostCreatedAt>2023-02-03 11:27</PostCreatedAt>
            </HistoryData>
          </HistoryItem>
        ))}
      </History>
    </StyledProfileHistory>
  );
};

export default ProfileHistory;

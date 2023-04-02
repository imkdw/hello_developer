import { useEffect, useState } from "react";
import { Search, useLocation } from "react-router-dom";
import styled from "styled-components";
import { searchBoards } from "../../services/BoardService";
import SearchHeader from "./SearchHeader";
import SearchItem from "./SearchItem";

const StyledSearch = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 6;
`;

const Boards = styled.ul`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 3%;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: #e8e8e8;
  }
  ::-webkit-scrollbar-thumb,
  ::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:active {
    background: #a7a7a7;
  }
  ::-webkit-scrollbar-button {
    display: none;
  }

  @media screen and (max-width: 767px) {
    ::-webkit-scrollbar {
      display: none;
    }

    gap: 0;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }
`;

interface SearchData {
  boardId: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    userId: string;
    nickname: string;
    profileImg: string;
  };
  view: {
    viewCnt: number;
  };
  tags: [{ name: number }];
  category2: { name: string } | null;
}

const SearchResult = () => {
  const location = useLocation();
  const searchText = new URLSearchParams(location.search).get("text") as string;
  const [boards, setBoards] = useState<SearchData[]>([]);

  useEffect(() => {
    const loadBoards = async () => {
      const res = await searchBoards(searchText);
      setBoards(res.data);
    };

    loadBoards();
  }, [searchText]);

  return (
    <StyledSearch>
      <SearchHeader />
      <Boards>
        {boards.map((board) => (
          <SearchItem key={board.boardId} board={board} />
        ))}
      </Boards>
    </StyledSearch>
  );
};

export default SearchResult;

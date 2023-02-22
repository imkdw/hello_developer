import styled from "styled-components";
import ListItem from "./ListItem";
import { useEffect, useState } from "react";
import { PostService } from "../../services/post";
import { PostListData } from "../../types/post";

const StyledList = styled.div`
  width: 100%;
  height: 75%;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0 30px;
  overflow: auto;

  @media screen and (max-width: 767px) {
    justify-content: center;
  }
`;

interface ListProps {
  category1: string;
  category2: string;
}

const List = ({ category1, category2 }: ListProps) => {
  const [postList, setPostList] = useState<PostListData[]>([]);

  useEffect(() => {
    const getPostList = async () => {
      const { status, posts } = await PostService.list(category1, category2);
      if (status === 200) {
        setPostList(posts || []);
      }
    };

    getPostList();
  }, [category1, category2]);

  return (
    <StyledList>
      {postList.map((postItem) => {
        const { user, post } = postItem;

        return <ListItem key={post.postId} user={user} post={post} />;
      })}
    </StyledList>
  );
};

export default List;

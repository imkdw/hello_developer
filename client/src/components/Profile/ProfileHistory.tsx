import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { userProfileState } from "../../recoil/user.recoil";
import { UserService } from "../../services/user";
import { UserHistoryPost } from "../../types/user";
import { dateFormat } from "../../utils/dateFormat";

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

const TabItem = styled.div<{ $isBorder: boolean }>`
  font-size: 20px;
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: ${(props) => (props.$isBorder ? "2px solid #0090f9" : "")};

  &:hover {
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

const HistoryItem = styled(Link)`
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
  const [posts, setPosts] = useState<UserHistoryPost[] | never[]>([]);
  const userProfile = useRecoilValue(userProfileState);
  const [enableTab, setEnableTag] = useState({
    post: true,
    comment: false,
    bookmark: false,
  });

  const historyHandler = async (item: "post" | "comment" | "bookmark") => {
    try {
      const res = await UserService.history(userProfile.userId, item);
      setPosts(res.data);
    } catch (err: any) {
      alert("????????????");
      console.error(err);
    }
  };

  const enableTagHandler = (item: "post" | "comment" | "bookmark") => {
    switch (item) {
      case "post":
        setEnableTag((prevState) => {
          return { ...prevState, post: true, comment: false, bookmark: false };
        });
        break;
      case "comment":
        setEnableTag((prevState) => {
          return { ...prevState, comment: true, post: false, bookmark: false };
        });
        break;
      case "bookmark":
        setEnableTag((prevState) => {
          return { ...prevState, bookmark: true, comment: false, post: false };
        });
        break;
    }
  };

  useEffect(() => {
    const getPost = async () => {
      await historyHandler("post");
    };

    if (userProfile.userId) {
      getPost();
    }
  }, [userProfile.userId]);

  interface CategoryData {
    [key: number]: string;
  }

  const categoryData: CategoryData = {
    1: "????????????",
    2: "????????????",
    3: "????????????",
    4: "????????????",
    5: "??????",
    6: "??????",
    7: "????????????",
    8: "??????",
    9: "?????????",
    10: "????????????",
    11: "????????????",
    12: "?????????",
    13: "????????????",
  };

  return (
    <StyledProfileHistory>
      <HistoryTab>
        <TabItem
          onClick={async () => {
            await historyHandler("post");
            enableTagHandler("post");
          }}
          $isBorder={enableTab.post}
        >
          ????????? ???
        </TabItem>
        <TabItem
          onClick={async () => {
            await historyHandler("comment");
            enableTagHandler("comment");
          }}
          $isBorder={enableTab.comment}
        >
          ????????? ??????
        </TabItem>
        <TabItem
          onClick={async () => {
            await historyHandler("bookmark");
            enableTagHandler("bookmark");
          }}
          $isBorder={enableTab.bookmark}
        >
          ????????? ???
        </TabItem>
      </HistoryTab>
      <History>
        {posts.length === 0 || !posts ? (
          <p style={{ fontSize: "20px", color: "gray", alignSelf: "center", marginTop: "50px" }}>???????????? ????????????.</p>
        ) : (
          <>
            {posts.map((post) => (
              <HistoryItem key={post.postId} to={"/post/" + post.postId}>
                <HistoryCategory>
                  ???????????? :{" "}
                  <CategoryText>
                    {categoryData[post.category1]}
                    {post.category2 ? " - " + categoryData[post.category2] : null}
                  </CategoryText>
                </HistoryCategory>
                <HistoryData>
                  <PostTitle>{post.title}</PostTitle>
                  <PostCreatedAt>{dateFormat(post.createdAt)}</PostCreatedAt>
                </HistoryData>
              </HistoryItem>
            ))}
          </>
        )}
      </History>
    </StyledProfileHistory>
  );
};

export default ProfileHistory;

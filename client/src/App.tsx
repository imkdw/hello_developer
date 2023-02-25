import { Route, Routes } from "react-router";
import { useRecoilValue } from "recoil";
import { AddPost } from "./components/AddPost";
import { AuthPage } from "./components/Auth";
import Verify from "./components/Auth/Verify/Verify";
import Loading from "./components/Common/Loading";
import NotFound from "./components/Error/NotFound";
import { Main } from "./components/Main";
import { PostDetail } from "./components/PostDetail";
import { PostList } from "./components/PostList";
import { Profile } from "./components/Profile";
import { UpdatePost } from "./components/UpdatePost";
import GlobalStyles from "./GlobalStyles";
import { isLoadingState } from "./recoil/ui.recoil";

const App = () => {
  const isLoading = useRecoilValue(isLoadingState);
  return (
    <>
      <GlobalStyles />
      {isLoading && <Loading />}
      <Routes>
        <Route path="/main" element={<Main currentPage="main" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/notice" element={<PostList currentPage="notice" />} />
        <Route path="/suggestion" element={<PostList currentPage="suggestion" />} />
        <Route path="/free" element={<PostList currentPage="free" />} />
        <Route path="/knowledge/*" element={<PostList currentPage="knowledge" />} />
        <Route path="/qna/*" element={<PostList currentPage="qna" />} />
        <Route path="/recruitment/*" element={<PostList currentPage="recruitment" />} />
        <Route path="/post/:postId" element={<PostDetail />} />
        <Route path="/post/add" element={<AddPost />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/verify/:verifyToken" element={<Verify />} />
        <Route path="/post/update/:postId" element={<UpdatePost />} />
        <Route path="/" element={<Main currentPage="main" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;

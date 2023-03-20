import { Route, Routes } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import AuthPage from "./pages/Auth/AuthPage";
import { useRecoilValue } from "recoil";
import { Loading } from "./components/Common";
import { isLoadingState } from "./recoil";
import MainPage from "./pages/Main/MainPage";
import NotFound from "./pages/Error/NotFound";
import VerifyPage from "./pages/Auth/VerifyPage";
import BoardListPage from "./pages/Board/BoardListPage";
import BoardDetailPage from "./pages/Board/BoardDetailPage";
import CreateBoardPage from "./pages/Board/CreateBoardPage";

function App() {
  const isLoading = useRecoilValue(isLoadingState);

  return (
    <>
      <GlobalStyles />
      {isLoading && <Loading />}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<AuthPage type="login" />} />
        <Route path="/register" element={<AuthPage type="register" />} />
        <Route path="/verify/:verifyToken" element={<VerifyPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/notice" element={<BoardListPage currentBoard="notice" />} />
        <Route path="/suggestion" element={<BoardListPage currentBoard="suggestion" />} />
        <Route path="/free" element={<BoardListPage currentBoard="free" />} />
        <Route path="/knowledge/*" element={<BoardListPage currentBoard="knowledge" />} />
        <Route path="/qna/*" element={<BoardListPage currentBoard="qna" />} />
        <Route path="/recruitment/*" element={<BoardListPage currentBoard="recruitment" />} />
        <Route path="/boards/add" element={<CreateBoardPage />} />
        <Route path="/boards/:boardId" element={<BoardDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

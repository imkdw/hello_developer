import { Route, Routes } from "react-router";
import { AuthPage } from "./components/Auth";
import { Main } from "./components/Main";
import { Post } from "./components/Post";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/notice" element={<Post currentPage="notice" />} />
        <Route path="/suggestion" element={<Post currentPage="suggestion" />} />
        <Route path="/free" element={<Post currentPage="free" />} />
        <Route path="/knowledge/*" element={<Post currentPage="knowledge" />} />
        <Route path="/qna/*" element={<Post currentPage="qna" />} />
        <Route path="/recruitment/*" element={<Post currentPage="recruitment" />} />
      </Routes>
    </>
  );
};

export default App;

import { Route, Routes } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import AuthPage from "./pages/Auth/AuthPage";
import { useRecoilValue } from "recoil";
import { Loading } from "./components/Common";
import { isLoadingState } from "./recoil";
import MainPage from "./pages/Main/MainPage";
import NotFound from "./pages/Error/NotFound";
import VerifyPage from "./pages/Auth/VerifyPage";

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;

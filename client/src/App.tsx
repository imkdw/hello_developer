import { Route, Routes } from "react-router";
import { AuthPage } from "./components/Auth";
import Main from "./components/Auth/Main/Main";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </>
  );
};

export default App;

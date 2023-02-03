import { Route, Routes } from "react-router";
import { AuthPage } from "./components/Auth";
import GlobalStyles from "./GlobalStyles";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
      </Routes>
    </>
  );
};

export default App;

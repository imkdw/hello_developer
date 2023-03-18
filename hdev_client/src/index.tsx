import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RecoilRoot>
);

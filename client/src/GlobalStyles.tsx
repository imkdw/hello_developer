import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }

  button {
    background-color: white;
    border: none;
  }

  a {
    color: #212121;
    text-decoration: none;
  }

  html, body {
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyles;

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    box-sizing: border-box;
  }

  button {
    background-color: white;
    border: none;
  }

  a {
    color: #212121;
    text-decoration: none;
  }
  
  input {
    border: none;
    outline: none;
  }

  li {
    /* list-style: none; */
  }

  input {
    border: none;
    outline: none;
  }

  button {
    cursor: pointer;
  }

  textarea {
    resize: none;
    border: none;
    outline: none;
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

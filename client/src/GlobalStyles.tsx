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

    /* input 자동완성시 검정색 글씨 지정 */
    &:-webkit-autofill {
      box-shadow: 0 0 0 30px #fff inset;
      -webkit-text-fill-color: #000;
    }
    /* input 자동완성시 파란색 배경색 비활성화 */
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
    }
  }

  li {
    list-style: none;
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

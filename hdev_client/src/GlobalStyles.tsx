import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
  }

  #root {
    width: 100%;
    height: 100%;
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

  button {
    border: none;
    cursor: pointer;
    background-color: white;
  }

  li {
    list-style: none;
  }
`;

export default GlobalStyles;

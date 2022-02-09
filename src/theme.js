import { createGlobalStyle } from "styled-components";

const lightTheme = {
  body: "#fff",
  fontColor: "#000",
};

const darkTheme = {
  body: "#000",
  fontColor: "#fff",
};

export { lightTheme, darkTheme };
export const GlobalStyles = createGlobalStyle`
  body{
    background-color: ${(props) => props.theme.body};
  }
`;

import React, { Component } from "react";
import Header from "./Header";
import Meta from "./Meta";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";

const theme = {
  red: "#FF0000",
  black: "#393939",
  grey: "#3A3A3A",
  white: "#FFFFFF",
  lightgrey: "#E1E1E1",
  offWhite: "#EDEDED",
  maxWidth: "1160px",
  bs: "0 12px 24px 0 rgba(0, 0, 0, 0.09)",
};

const StyleComp = styled.div`
  background: ${(props) => props.theme.white};
  color: ${(props) => props.theme.black};
`;

const GridContainer = styled.div`
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
`;

const GlobalStyled = createGlobalStyle`
  @font-face {
    font-family: 'FiraSans';
    src: url('FiraSans-Regular.eot'); /* IE9 Compat Modes */
    src: url('FiraSans-Regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('FiraSans-Regular.woff2') format('woff2'), /* Super Modern Browsers */
        url('FiraSans-Regular.woff') format('woff'), /* Pretty Modern Browsers */
        url('FiraSans-Regular.ttf')  format('truetype'), /* Safari, Android, iOS */
        url('FiraSans-Regular.svg#svgFontName') format('svg'); /* Legacy iOS */
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'FiraSans';
    src: url('FiraSans-Bold.eot'); /* IE9 Compat Modes */
    src: url('FiraSans-Bold.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('FiraSans-Bold.woff2') format('woff2'), /* Super Modern Browsers */
        url('FiraSans-Bold.woff') format('woff'), /* Pretty Modern Browsers */
        url('FiraSans-Bold.ttf')  format('truetype'), /* Safari, Android, iOS */
        url('FiraSans-Bold.svg#svgFontName') format('svg'); /* Legacy iOS */
    font-weight: 600;
    font-style: normal;
  }

  html {
    box-sizing: border-box;
    font-size: 12px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 244px 0 0;
    margin: 0;
    font-size: 1.5rem;
    line-height: 2;
    font-family: 'FiraSans', sans-serif;
  }
  a {
    text-decoration: none;
    color: ${theme.black};
  }
  button {
    border: 1px solid ${(props) => props.theme.red};
    font-family: 'FiraSans', sans-serif;
    font-weight: 600;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      /* border: 1px solid ${(props) => props.theme.red}; */
      background-color: ${(props) => props.theme.white};
      color: ${(props) => props.theme.red};
    }
    &:disabled,
    &[disabled] {
      color: ${(props) => props.theme.lightgrey}!important;
    }
  }
`;

class GlobalComponent extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyled />
        <StyleComp>
          <Meta />
          <Header />
          <GridContainer>{this.props.children}</GridContainer>
        </StyleComp>
      </ThemeProvider>
    );
  }
}

export default GlobalComponent;

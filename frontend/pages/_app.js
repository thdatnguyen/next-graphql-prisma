import App from "next/app";
import GlobalComponent from "../components/GlobalComponent";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <GlobalComponent>
        <Component {...pageProps} />
      </GlobalComponent>
    );
  }
}

export default MyApp;

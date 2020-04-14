import App from "next/app";
import { ApolloProvider } from "react-apollo";

import GlobalComponent from "../components/GlobalComponent.component";

import withData from "../lib/withData";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    return { pageProps };
  }
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <ApolloProvider client={apollo}>
        <GlobalComponent>
          <Component {...pageProps} />
        </GlobalComponent>
      </ApolloProvider>
    );
  }
}

export default withData(MyApp);

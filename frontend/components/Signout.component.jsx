import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Router from "next/router";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User.component";

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

class Signout extends Component {
  handleSignout = (signout) => {
    signout();
    Router.push({
      pathname: "/",
    });
  };
  render() {
    return (
      <Mutation
        mutation={SIGN_OUT_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signout) => (
          <button
            onClick={() => {
              this.handleSignout(signout);
            }}
          >
            Sign out
          </button>
        )}
      </Mutation>
    );
  }
}

export default Signout;

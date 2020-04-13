import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import ErrorMessage from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

function totalItems(cart) {
  return cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0);
}

class Checkout extends Component {
  onReceivedToken = (res, createOrder) => {
    console.log(res);
    // manually call the mutation once we have the stripe token
    createOrder({
      variables: {
        token: res.id,
      },
    }).catch((err) => alert(err.message));
  };
  render() {
    return (
      <User>
        {({ data }) => {
          const me = data ? data.me : null;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
              {(createOrder, { data, loading, error }) => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name={`${me.name}'s checkout payment`}
                  description={`Order of ${totalItems(me.cart)} item${
                    totalItems(me.cart) > 1 ? "s" : ""
                  }`}
                  image={me.cart[0].item && me.cart[0].item.image}
                  stripeKey="pk_test_LeEcviPnQEGZzqqiN9CKaE0v00L2TKaWXe"
                  currency="USD"
                  email={me.email}
                  token={(res) => this.onReceivedToken(res, createOrder)}
                >
                  {this.props.children}
                </StripeCheckout>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default Checkout;

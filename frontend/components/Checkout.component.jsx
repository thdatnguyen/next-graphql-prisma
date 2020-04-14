import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
// import ErrorMessage from "./ErrorMessage.component";
import User, { CURRENT_USER_QUERY } from "./User.component";
import { USER_ORDERS_QUERY } from "./Orders.component";

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
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
  onReceivedToken = async (res, createOrder) => {
    NProgress.start();
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch((err) => alert(err.message));
    Router.push({
      pathname: "/order",
      query: { id: order.data.createOrder.id },
    });
  };
  render() {
    return (
      <User>
        {({ data }) => {
          const me = data ? data.me : null;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[
                { query: CURRENT_USER_QUERY },
                { query: USER_ORDERS_QUERY },
              ]}
            >
              {(createOrder) => (
                <StripeCheckout
                  amount={calcTotalPrice(me.cart)}
                  name={`${me.name}'s checkout payment`}
                  description={`Order of ${totalItems(me.cart)} item${
                    totalItems(me.cart) > 1 ? "s" : ""
                  }`}
                  image={
                    me.cart.length && me.cart[0].item && me.cart[0].item.image
                  }
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

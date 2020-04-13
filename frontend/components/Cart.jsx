import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import User from "./User";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import Checkout from "../components/Checkout";
const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
});

const Cart = () => (
  <Composed>
    {({ user: { data }, toggleCart, localState }) => {
      const me = data ? data.me : null;
      if (!me) return null;

      return (
        <CartStyles open={localState.data.cartOpen}>
          <header>
            <CloseButton onClick={toggleCart} title="close">
              &times;
            </CloseButton>
            <Supreme>{me.name}'s Cart</Supreme>
            <p>
              You Have {me.cart.length} Item
              {me.cart.length > 1 ? "s" : ""} in your cart.
            </p>
          </header>
          <ul>
            {me.cart.map((cartItem) => (
              <CartItem cartItem={cartItem} key={cartItem.id}>
                {cartItem.id}
              </CartItem>
            ))}
          </ul>
          <footer>
            <p>Total: {formatMoney(calcTotalPrice(me.cart))}</p>
            <Checkout>
              <SickButton>Checkout</SickButton>
            </Checkout>
          </footer>
        </CartStyles>
      );
    }}
  </Composed>
);

export default Cart;
export { TOGGLE_CART_MUTATION, LOCAL_STATE_QUERY };

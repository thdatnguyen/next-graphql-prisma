import React, { Component } from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  // this gets called asa we get a response
  // back from the server after a mutation has been performed
  update = (cache, payload) => {
    // first read the cache
    const data = cache.readQuery({
      query: CURRENT_USER_QUERY,
    });
    // remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id;
    data.me.cart = data.me.cart.filter(
      (cartItem) => cartItem.id !== cartItemId
    );
    // write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typeName: "CartItem",
            id: this.props.id,
          },
        }}
      >
        {(removeFromCart, { loading, error }) => {
          return (
            <DeleteItemButtonStyle
              disabled={loading}
              title="Delete Item"
              onClick={() => {
                removeFromCart().catch((err) => alert(err.message));
              }}
            >
              &times;
            </DeleteItemButtonStyle>
          );
        }}
      </Mutation>
    );
  }
}

const DeleteItemButtonStyle = styled.button`
  font-size: 3rem;
  background-color: none;
  border: 0;
  &:hover {
    color: ${(props) => props.theme.red};
    cursor: pointer;
  }
`;

export default RemoveFromCart;

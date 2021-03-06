import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User.component';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`;

class AddToCart extends Component {
  handleAddToCart = async (addToCart) => {
    await addToCart().catch((err) => alert(err.message));
  };
  render() {
    const { id } = this.props;
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(addToCart, { loading }) => (
          <button
            className="btn-add-to-cart"
            disabled={loading}
            onClick={() => this.handleAddToCart(addToCart)}
          >
            Add{loading ? 'ing' : ''} To Cart
          </button>
        )}
      </Mutation>
    );
  }
}

export default AddToCart;

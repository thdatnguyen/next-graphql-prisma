import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format, parseISO } from "date-fns";
import Head from "next/head";
import gql from "graphql-tag";
import formatMoney from "../lib/formatMoney";
import ErrorMessage from "./ErrorMessage.component";
import OrderStyles from "./styles/OrderStyles";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  };
  render() {
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (error) return <ErrorMessage error={error} />;
          if (loading) return <p>Loading...</p>;
          const order = data ? data.order : null;
          return (
            <OrderStyles>
              <Head>
                <title>Tada's Ecommerce - Order {order.id}</title>
              </Head>
              <p>
                <span>Order Id: </span>
                <span>{this.props.id}</span>
              </p>
              <p>
                <span>Date: </span>
                <span>
                  {format(parseISO(order.createdAt), "MMMM d, yyyy h:mm a", {
                    awareOfUnicodeTokens: true,
                  })}
                </span>
              </p>
              <p>
                <span>Order total: </span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Item Count: </span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Quantity: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>Description: {item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;

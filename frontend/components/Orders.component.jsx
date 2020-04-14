import React from "react";
import { Query } from "react-apollo";
import { format, parseISO, formatDistance } from "date-fns";
import gql from "graphql-tag";
import Link from "next/link";
import styled from "styled-components";

import ErrorMessage from "./ErrorMessage.component";

import OrderItemStyles from "./styles/OrderItemStyles";

import formatMoney from "../lib/formatMoney";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const Orders = () => {
  return (
    <Query query={USER_ORDERS_QUERY}>
      {({ data, loading, error }) => {
        if (error) return <ErrorMessage error={error} />;
        if (loading) return <p>Loading...</p>;
        const orders = data ? data.orders : null;

        return (
          <OrderWrapper>
            {orders.map((order) => (
              <OrderItemStyles key={order.id}>
                <Link
                  href={{
                    pathname: "/order",
                    query: { id: order.id },
                  }}
                >
                  <a>
                    <div className="order-meta">
                      <p>
                        {order.items.reduce(
                          (tally, item) => tally + item.quantity,
                          0
                        )}{" "}
                        Item
                        {order.items.reduce(
                          (tally, item) => tally + item.quantity,
                          0
                        ) > 1
                          ? "s"
                          : ""}
                      </p>
                      <p>
                        {order.items.length} Product
                        {order.items.length > 1 ? "s" : ""}
                      </p>
                      <p>
                        {format(
                          parseISO(order.createdAt),
                          "MMMM d, yyyy h:mm a",
                          { awareOfUnicodeTokens: true }
                        )}
                      </p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map((item) => (
                        <img src={item.image} alt={item.title} key={item.id} />
                      ))}
                    </div>
                  </a>
                </Link>
              </OrderItemStyles>
            ))}
          </OrderWrapper>
        );
      }}
    </Query>
  );
};

const OrderWrapper = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat() (auto-fit, minmax(40%, 1fr));
`;

export default Orders;
export { USER_ORDERS_QUERY };

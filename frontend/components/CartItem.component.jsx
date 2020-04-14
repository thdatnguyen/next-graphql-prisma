import React from "react";
import formatMoney from "../lib/formatMoney";
import styled from "styled-components";
import PropTypes from "prop-types";

import RemoveFromCart from "./RemoveFromCart.component";

const CartItem = ({ cartItem: { id, quantity, item } }) => {
  if (!item)
    return (
      <CartItemStyles>
        <p>This item has been removed</p>
        <RemoveFromCart id={id} />
      </CartItemStyles>
    );
  return (
    <CartItemStyles>
      <img src={item.image} width="100" alt={item.title} />
      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p>
          <strong>{formatMoney(item.price * quantity)}</strong>{" "}
          <em>
            ({quantity} &times; {formatMoney(item.price)})
          </em>
        </p>
      </div>
      <RemoveFromCart id={id} />
    </CartItemStyles>
  );
};

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired,
};

export default CartItem;

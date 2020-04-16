import React from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';

import NavStyles from './styles/NavStyles';

import User from './User.component';
import Signout from './Signout.component';
import { TOGGLE_CART_MUTATION } from './Cart.component';
import CartCount from './CartCount.component';
// import Permissions from "./Permissions.component";

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      const isAdmin = me ? me.permissions.includes('ADMIN') : false;
      return (
        <NavStyles>
          <li>
            <Link href="/shop">
              <a>Shop</a>
            </Link>
          </li>
          {me && isAdmin && (
            <>
              <li>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
              </li>
              <li>
                <Link href="/permissions">
                  <a>Permission</a>
                </Link>
              </li>
            </>
          )}
          {me && (
            <>
              <li>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
              </li>
              {/* <li>
                <Link href="/me">
                  <a>Account</a>
                </Link>
              </li> */}
              <li>
                <Signout />
              </li>
              <li>
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                  {(toggleCart) => (
                    <button onClick={toggleCart}>
                      My Cart{' '}
                      <CartCount
                        count={me.cart.reduce(
                          (tally, cartItem) => tally + cartItem.quantity,
                          0
                        )}
                      />
                    </button>
                  )}
                </Mutation>
              </li>
            </>
          )}

          {!me && (
            <li>
              <Link href="/signup">
                <a>Sign In</a>
              </Link>
            </li>
          )}
        </NavStyles>
      );
    }}
  </User>
);
export default Nav;

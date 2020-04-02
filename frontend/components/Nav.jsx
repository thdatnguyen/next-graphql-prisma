import React from "react";
import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import Signout from "./Signout";
const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles>
          <li>
            <Link href="/shop">
              <a>Shop</a>
            </Link>
          </li>
          {me && (
            <>
              <li>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
              </li>
              <li>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
              </li>
              <li>
                <Link href="/me">
                  <a>Account</a>
                </Link>
              </li>
              <li>
                <Signout />
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

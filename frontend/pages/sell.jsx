import React, { Component } from "react";
import Link from "next/link";
class Sell extends Component {
  render() {
    return (
      <div>
        <h1>Sell</h1>
        <Link href="/">
          <a>Home</a>
        </Link>
      </div>
    );
  }
}

export default Sell;

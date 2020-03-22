import React, { Component } from "react";
import Link from "next/link";
class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <Link href="/sell">
          <a>Sell</a>
        </Link>
      </div>
    );
  }
}

export default Home;

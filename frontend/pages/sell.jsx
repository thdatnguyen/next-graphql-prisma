import React, { Component } from "react";
// import Link from "next/link";
import CreateItem from "../components/CreateItem.component";
import PleaseSignIn from "../components/PleaseSignIn.component";

const Sell = () => (
  <div>
    <PleaseSignIn>
      <CreateItem />
    </PleaseSignIn>
  </div>
);

export default Sell;

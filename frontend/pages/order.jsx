import React from "react";
import Order from "../components/Order.component";
import PleaseSignIn from "../components/PleaseSignIn.component";

const order = (props) => {
  return (
    <div>
      <PleaseSignIn>
        <Order id={props.query.id} />
      </PleaseSignIn>
    </div>
  );
};

export default order;

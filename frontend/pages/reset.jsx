import React from "react";
import ResetPassword from "../components/ResetPassword";
const reset = props => {
  return (
    <div>
      Reset with token: {props.query.resetToken}
      <ResetPassword resetToken={props.query.resetToken} />
    </div>
  );
};

export default reset;

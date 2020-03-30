import React from "react";
import UpdateItem from "../components/UpdateItem";

const update = ({ query: { id } }) => {
  return (
    <div>
      <UpdateItem id={id} />
    </div>
  );
};

export default update;

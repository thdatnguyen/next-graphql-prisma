import React, { Component } from "react";
import Signup from "../components/Signup";
import styled from "styled-components";

const SignupWrappper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

class signpupPage extends Component {
  render() {
    return (
      <SignupWrappper>
        <Signup />
        {/* <Signup />
        <Signup /> */}
      </SignupWrappper>
    );
  }
}

export default signpupPage;

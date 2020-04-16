import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage.component';
import { CURRENT_USER_QUERY } from './User.component';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  };
  state = {
    password: '',
    confirmPassword: '',
  };
  saveToState = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[
          {
            query: CURRENT_USER_QUERY,
          },
        ]}
      >
        {(reset, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await reset();
              this.setState({
                password: '',
                confirmPassword: '',
              });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Your Password !!!</h2>
              <ErrorMessage error={error} />

              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Reset password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default ResetPassword;

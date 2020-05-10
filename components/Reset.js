import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $oldPassword: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, oldPassword: $oldPassword, password: $password, confirmPassword: $confirmPassword) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  state = {
    oldPassword: '',
    password: '',
    confirmPassword: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          oldPassword: this.state.oldPassword,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        }}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(reset, { error, loading, called }) => {
          const passwordReset = !error && !loading && called;
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await reset();
                this.setState({
                  oldPassword: '',
                  password: '',
                  confirmPassword: '',
                });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset your password</h2>
                <ErrorMessage error={error} />
                {!passwordReset ? (
                  <>
                    <label htmlFor="oldPassword">
                      Current password
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder="current password"
                        value={this.state.oldPassword}
                        onChange={this.saveToState}
                      />
                    </label>
                    <label htmlFor="password">
                      New password
                      <input
                        type="password"
                        name="password"
                        placeholder="new password"
                        value={this.state.password}
                        onChange={this.saveToState}
                      />
                    </label>
                    <label htmlFor="confirmPassword">
                      Confirm your new password
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="confirm new password"
                        value={this.state.confirmPassword}
                        onChange={this.saveToState}
                      />
                    </label>
                    <button type="submit">Reset</button>
                  </>
                ) : <p>Password reset successfully!</p> }
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

Reset.propTypes = {
  resetToken: PropTypes.string.isRequired,
};

export default Reset;

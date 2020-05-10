import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { Fieldset } from './Signin';
import User from './User';

export const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  requestReset: ({ render }) => (
    <Mutation mutation={REQUEST_RESET_MUTATION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
});

class RequestReset extends Component {
  state = {
    email: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Composed>
        {({ user, requestReset }) => {
          const { me } = user.data;
          const { mutation, result } = requestReset;
          const resetLinkSent = !result.error && !result.loading && result.called;
          return (
            <Form
              data-test="form"
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const email = me ? me.email : this.state.email;
                await mutation({ variables: { email } });
                if (this.state.email) {
                  this.setState({ email: '' });
                }
              }}
            >
              <Fieldset disabled={result.loading} aria-busy={result.loading}>
                <div>
                  <h2>Request a password reset</h2>
                  <ErrorMessage error={result.error} />
                  {me && <p>Email: {me.email}</p>}
                  {resetLinkSent && <p>Success! Check your email for a reset link!</p>}
                  {!resetLinkSent && (
                  <>
                    {!me && (
                    <label htmlFor="email">
                      Email
                      <input
                        type="email"
                        name="email"
                        placeholder="email"
                        value={this.state.email}
                        onChange={this.saveToState}
                      />
                    </label>
                    )}
                    <button type="submit">Request reset</button>
                  </>
                  )}
                </div>
              </Fieldset>
            </Form>
          );
        }}
      </Composed>
    );
  }
}

export default RequestReset;

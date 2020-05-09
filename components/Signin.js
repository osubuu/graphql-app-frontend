import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

export const Fieldset = styled.fieldset`
  height: 100%;
  width: 100%;

  & > div{
    height: calc(100% - 10px);
    width: 100%;
    display: flex;
    flex-direction: column;

    > label:last-of-type {
      margin-bottom: 2rem;
    }

    > button {
      cursor: pointer;
      align-self: flex-start;
      margin-top: auto;
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(signup, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await signup();
              this.setState({
                email: '',
                password: '',
              });
            }}
          >
            <Fieldset disabled={loading} aria-busy={loading}>
              <div>
                <h2>Sign into your account</h2>
                <ErrorMessage error={error} />
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
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={this.state.password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign in</button>
              </div>
            </Fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default Signin;

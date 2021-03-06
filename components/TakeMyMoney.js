import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, { CURRENT_USER_QUERY } from './User';

export const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

const totalItems = cart => cart.reduce((total, cartItem) => total + cartItem.quantity, 0);

class TakeMyMoney extends Component {
  // get token to then pass it to backend to actually charge the card
  // (i.e token here is sort of like a meal ticket)
  onToken = async (res, createOrder) => {
    NProgress.start();
    // manually call the mutation once we have the stripe token
    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch(err => { alert(err.message); });

    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id },
    });
  }

  render() {
    return (
      <User>
        {({ data: { me }, loading }) => {
          if (loading) return null;
          return (
            <Mutation
              mutation={CREATE_ORDER_MUTATION}
              refetchQueries={[{
                query: CURRENT_USER_QUERY,
              }]}
            >
              {createOrder => (
                <StripeCheckout
                  name="Hoodify"
                  email={me.email}
                  token={res => this.onToken(res, createOrder)}
                  image={me.cart.length && me.cart[0].item && me.cart[0].item.image}
                  amount={calcTotalPrice(me.cart)}
                  currency="USD"
                  stripeKey="pk_test_6yUD5q8liiWCZPF78ZQZe3Ie00ixD2vxhr"
                  description={`Order of ${totalItems(me.cart)} items`}
                >
                  <p>{this.props.children}</p>
                </StripeCheckout>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;

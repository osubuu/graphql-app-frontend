import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import ErrorMessage from './ErrorMessage';
import User, { CURRENT_USER_QUERY } from './User';

const totalItems = cart => cart.reduce((total, cartItem) => total + cartItem.quantity, 0);

class TakeMyMoney extends Component {

  // get token to then pass it to backend to actually charge the card
  // (i.e token here is sort of like a meal ticket)
  onToken = res => {
    console.log(res);
  }

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            name="Sick Fits"
            email={me.email}
            token={res => this.onToken(res)}
            image={me.cart[0].item && me.cart[0].item.image}
            amount={calcTotalPrice(me.cart)}
            currency="USD"
            stripeKey="pk_test_6yUD5q8liiWCZPF78ZQZe3Ie00ixD2vxhr"
            description={`Order of ${totalItems(me.cart)} items`}>
            <p>{this.props.children}</p>
          </StripeCheckout>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;

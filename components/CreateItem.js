import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import Router from 'next/router';

// recall: these mutations and queries were defined in schema.grapql yoga file in the back-end
export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: 'Cool shoes',
    description: 'I love these words',
    image: 'dog.jpg',
    largeImage: 'dogLarge.jpg',
    price: 1000,
  }

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val })
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        variables={this.state}>
        {(createItem, { loading, error, called, data }) => (
          <Form onSubmit={async e => {
            e.preventDefault();
            const res = await createItem(); // sends the mutation request
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id }
            });
          }}>
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor='title'>
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange} />
              </label>

              <label htmlFor='price'>
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange} />
              </label>

              <label htmlFor='description'>
                Description
                <input
                  id="description"
                  name="description"
                  required
                  placeholder="Enter a description"
                  value={this.state.description}
                  onChange={this.handleChange} />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem;

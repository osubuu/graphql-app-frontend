import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { PAGINATION_QUERY } from './Pagination';

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
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' && value ? parseFloat(value) : value;
    this.setState({ [name]: val });
  }

  uploadFile = async e => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'graphql-app');

    const res = await fetch('https://api.cloudinary.com/v1_1/df7nqbjav/image/upload/', {
      method: 'POST',
      body: data,
    });

    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_ITEM_MUTATION}
        refetchQueries={[
          { query: PAGINATION_QUERY },
        ]}
        variables={this.state}
      >
        {(createItem, { loading, error }) => (
          <Form
            data-test="form"
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem(); // sends the mutation request
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id },
              });
            }}
          >
            <ErrorMessage error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  required
                  placeholder="Upload an image"
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                <img
                  width="200"
                  src={this.state.image}
                  alt="Upload Preview"
                />
                )}
              </label>

              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>

              <label htmlFor="description">
                Description
                <input
                  id="description"
                  name="description"
                  required
                  placeholder="Enter a description"
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;

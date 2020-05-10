import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { adopt } from 'react-adopt';
import User from './User';

import ErrorMessage from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 800px;

  .image-container{
    width: 30rem;
    margin-top: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
    text-align: center;
  }

  .buttonList {
    display: grid;
    width: 80%;
    border: 1px solid ${props => props.theme.lightGrey};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.lightGrey};
    margin-top: 4rem;
    & > * {
      text-align: center;
      background: white;
      border: 0;
      font-size: 1rem;
      padding: 1rem;
      cursor: pointer;

      &:hover {
        color: ${props => props.theme.teal};
      }
    }
  }
`;

export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      title
      description
      largeImage
      price
      user {
        id
      }
    }
  }
`;

const SingleItem = props => {
  const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    singleItem: ({ render }) => (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{ id: props.id }}
      >{render}
      </Query>
    ),
  });

  return (
    <Composed>
      {({ user, singleItem }) => {
        if (singleItem.error) return <ErrorMessage error={singleItem.error} />;
        if (singleItem.loading) return <p>Loading...</p>;
        if (!singleItem.data.item) return <p>No Item Found for {props.id}</p>;
        const { item } = singleItem.data;
        const canEditAndDelete = user.data.me && user.data.me.id === item.user.id;
        return (
          <SingleItemStyles>
            <Head>
              <title>Hoodify - {item.title}</title>
            </Head>
            <div className="details">
              <h2>Viewing: {item.title}</h2>
              <h3>{formatMoney(item.price)}</h3>
              <p>{item.description}</p>
            </div>
            <div className="image-container">
              <img src={item.largeImage} alt={item.title} />
            </div>
            <div className="buttonList">
              {canEditAndDelete && (
              <Link href={{
                pathname: 'update',
                query: { id: item.id },
              }}
              >
                <a>Edit</a>
              </Link>
              )}
              <AddToCart id={item.id} />
              {canEditAndDelete && <DeleteItem id={item.id}>Delete This Item</DeleteItem>}
            </div>
          </SingleItemStyles>
        );
      }}
    </Composed>
  );
};

export default SingleItem;

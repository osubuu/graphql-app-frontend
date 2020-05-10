import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { adopt } from 'react-adopt';

import Pagination from './Pagination';
import User from './User';
import Item from './Item';
import { perPage } from '../config';

// best practice to put queries in CAPS
export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
      user {
        id
      }
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;


const Items = props => {
  const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    items: ({ render }) => (
      <Query
        query={ALL_ITEMS_QUERY}
        variables={{
          skip: props.page * perPage - perPage,
        }}
      >{render}
      </Query>
    ),
  });

  return (
    <Composed>
      {({ user, items }) => {
        if (items.loading) return <p>Loading...</p>;
        if (items.error) return <p>Error: {items.error.message}</p>;
        return (
          <Center>
            <Pagination page={props.page} />
            <ItemsList>
              {items.data.items.map(item => <Item item={item} key={item.id} me={user.data.me} />)}
            </ItemsList>
            <Pagination page={props.page} />
          </Center>
        );
      }}
    </Composed>
  );
};

export default Items;

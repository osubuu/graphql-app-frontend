import { Query } from 'react-apollo';
import { formatDistance, parseISO } from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import ErrorMessage from './ErrorMessage';

const USERS_ORDER_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
        description
        quantity
        image
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const OrderList = () => (
  <Query query={USERS_ORDER_QUERY}>
    {({ data: { orders }, loading, error }) => {
      if (error) return <ErrorMessage error={error} />;
      if (loading) return <p>Loading...</p>;
      return (
        <div>
          <h2>You have {orders.length} orders</h2>
          <OrderUl>
            {orders.map(order => (
              <OrderItemStyles key={order.id}>
                <Link href={{
                  pathname: '/order',
                  query: { id: order.id },
                }}
                >
                  <a>
                    <div className="order-meta">
                      <p>{order.items.reduce((total, item) => total + item.quantity, 0)} Items</p>
                      <p>{order.items.length} Product</p>
                      <p>{formatDistance(parseISO(order.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                      </p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map(item => (
                        <img key={item.id} src={item.image} alt={item.title} />
                      ))}
                    </div>
                  </a>
                </Link>
              </OrderItemStyles>
            ))}
          </OrderUl>
        </div>
      );
    }}
  </Query>
);

export default OrderList;

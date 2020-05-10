import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';

import DeleteItem from './DeleteItem';
import AddToCart from './AddToCart';

const Item = props => {
  const { item, me } = props;
  const canEditAndDelete = me && me.id === item.user.id;
  return (
    <ItemStyles>
      <Link href={{
        pathname: '/item',
        query: { id: item.id },
      }}
      >
        <a>
          {item.image && <img src={item.image} alt={item.title} />}
        </a>
      </Link>
      <Title>
        <Link href={{
          pathname: '/item',
          query: { id: item.id },
        }}
        >
          <a>{item.title}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(item.price)}</PriceTag>
      <p>{item.description}</p>

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
    </ItemStyles>
  );
};

Item.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default Item;

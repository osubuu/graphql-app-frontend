import React, { Component } from 'react';
import Downshift, { resetIdCounter } from 'downshift';
import Router from 'next/router';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce'; // used to prevent spamming functions too often
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(where: {
      OR: [
        { title_contains: $searchTerm }
        { description_contains: $searchTerm }
      ]
    }) {
      id
      image
      title
    }
  }
`;

const routeToItem = item => {
  Router.push({
    pathname: '/item',
    query: {
      id: item.id,
    },
  });
};

class Search extends Component {
  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    // turn loading on
    this.setState({ loading: true });
    // manually query apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value },
    });
    this.setState({
      items: res.data.items,
      loading: false,
    });
  }, 350); // run function only after 350 ms

  render() {
    resetIdCounter(); // to fix downshif labelledby error
    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={item => (item === null ? '' : item.title)}
        >
          {/* these are called render props */}
          {({
            getInputProps, getItemProps, isOpen, inputValue, highlightedIndex,
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: 'search',
                      placeholder: 'Search for an item',
                      id: 'search',
                      className: this.state.loading ? 'loading' : '',
                      onChange: e => {
                        e.persist();
                        this.onChange(e, client);
                      },
                    })}
                  />
                )}
              </ApolloConsumer>
              {/* isOpen automatically detects if we click outside of search input
               or click something like ESC */}
              {isOpen && (
              <DropDown>
                {this.state.items.map((item, index) => (
                  <DropDownItem
                    {...getItemProps({ item })}
                    key={item.id}
                    highlighted={index === highlightedIndex}
                  >
                    <img width="50" src={item.image} alt={item.title} />
                    {item.title}
                  </DropDownItem>
                ))}
                {!this.state.items.length && !this.state.loading && (
                <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                )}
              </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default Search;

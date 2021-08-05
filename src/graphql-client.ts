import { createHttpLink, ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client/core';
import {} from './types'

module.exports = function({ graphqlUrl, backendKey }) {
    const httpLink = createHttpLink({ uri: graphqlUrl })
  
    const authLink = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext(({ headers = {} }) => ({
          headers: {
              ...headers,
              'X-Commerce-Backend-Key': backendKey,
          }
      }));

      return forward(operation);
  })
    
    let client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return client
}
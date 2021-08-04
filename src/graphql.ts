import { createHttpLink, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export default function({ graphqlUrl, backendKey }) {
    const httpLink = createHttpLink({ uri: graphqlUrl })
  
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'X-Commerce-Backend-Key': backendKey,
      }
    }));
      
    let client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });

    return client
}
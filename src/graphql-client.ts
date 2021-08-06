import { createHttpLink, ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import fetch from 'node-fetch'

export default function({ graphqlUrl, backendKey }) {
  const httpLink = createHttpLink({ uri: graphqlUrl, fetch: fetch })

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
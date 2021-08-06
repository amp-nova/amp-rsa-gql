import { ApolloClient } from '@apollo/client/core';
export default function ({ graphqlUrl, backendKey }: {
    graphqlUrl: any;
    backendKey: any;
}): ApolloClient<import("@apollo/client/core").NormalizedCacheObject>;

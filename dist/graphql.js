"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@apollo/client");
const context_1 = require("@apollo/client/link/context");
function default_1({ graphqlUrl, backendKey }) {
    const httpLink = client_1.createHttpLink({ uri: graphqlUrl });
    const authLink = context_1.setContext((_, { headers }) => ({
        headers: {
            ...headers,
            'X-Commerce-Backend-Key': backendKey,
        }
    }));
    let client = new client_1.ApolloClient({
        link: authLink.concat(httpLink),
        cache: new client_1.InMemoryCache()
    });
    return client;
}
exports.default = default_1;

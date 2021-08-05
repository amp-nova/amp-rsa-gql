"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@apollo/client/core");
module.exports = function ({ graphqlUrl, backendKey }) {
    const httpLink = core_1.createHttpLink({ uri: graphqlUrl });
    const authLink = new core_1.ApolloLink((operation, forward) => {
        // add the authorization to the headers
        operation.setContext(({ headers = {} }) => ({
            headers: {
                ...headers,
                'X-Commerce-Backend-Key': backendKey,
            }
        }));
        return forward(operation);
    });
    let client = new core_1.ApolloClient({
        link: authLink.concat(httpLink),
        cache: new core_1.InMemoryCache()
    });
    return client;
};

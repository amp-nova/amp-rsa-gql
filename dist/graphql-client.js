"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@apollo/client/core");
const node_fetch_1 = __importDefault(require("node-fetch"));
function default_1({ graphqlUrl, backendKey }) {
    const httpLink = core_1.createHttpLink({ uri: graphqlUrl, fetch: node_fetch_1.default });
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
}
exports.default = default_1;

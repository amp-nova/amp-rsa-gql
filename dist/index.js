"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const graphql_client_1 = __importDefault(require("./graphql-client"));
const queries_1 = require("./queries");
__exportStar(require("./types"), exports);
function default_1(graphqlConfig) {
    let client = graphql_client_1.default(graphqlConfig);
    return {
        fetchAllProducts: async function (args) {
            return (await client.query({ query: queries_1.productsQuery(args) })).data.products;
        },
        fetchProduct: async function (args) {
            return (await client.query({ query: queries_1.productQuery(args) })).data.product;
        },
        fetchCategoryHierarchy: async function () {
            return (await client.query({ query: queries_1.categoryHierarchyQuery })).data.categoryHierarchy;
        },
        fetchCategory: async function (args) {
            return (await client.query({ query: queries_1.categoryQuery(args) })).data.category;
        }
    };
}
exports.default = default_1;

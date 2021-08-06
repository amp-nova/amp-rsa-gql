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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProducts = exports.queryProducts = exports.fetchProducts = exports.fetchProduct = exports.CATEGORY_QUERY = exports.PRODUCT_QUERY = exports.PRODUCTS_QUERY = exports.CATEGORY_HIERARCHY_QUERY = void 0;
require("reflect-metadata");
const { gql } = require('@apollo/client/core');
const GraphQL = require('./graphql-client');
const commonFields = `
    id
    name
    slug
`;
const meta = `
    meta {
        total
        limit
        count
        offset
    }
`;
const productFields = `
    ${commonFields}
    longDescription
    categories {
        ${commonFields}
    }
    variants {
        sku
        articleNumberMax: attribute(name: "articleNumberMax")
        prices {
            list
            sale
        }
        images {
            url
        }
    }
`;
exports.CATEGORY_HIERARCHY_QUERY = gql `    
    query {
        categoryHierarchy {
            ${commonFields}
            children {
                ${commonFields}
                children {
                    ${commonFields}
                }
            }
        }
    }
`;
const PRODUCTS_QUERY = (args, context) => gql `
    query productsQuery {
        ${args.keyword ? `products(keyword:"${args.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`;
exports.PRODUCTS_QUERY = PRODUCTS_QUERY;
const lookupArgs = args => {
    if (args.id) {
        return `id:"${args.id}"`;
    }
    else if (args.sku) {
        return `sku:"${args.sku}"`;
    }
    else if (args.slug) {
        return `slug:"${args.slug}"`;
    }
    else {
        throw new Error("id, sku, or slug must be specified");
    }
};
const PRODUCT_QUERY = (args, context) => gql `
    query productQuery {
        product(${lookupArgs(args)}) {
            ${productFields}
        }
    }
`;
exports.PRODUCT_QUERY = PRODUCT_QUERY;
const CATEGORY_QUERY = (args, context) => gql `
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`;
exports.CATEGORY_QUERY = CATEGORY_QUERY;
async function fetchProduct(args, cmsContext, graphqlConfig) {
    try {
        let graphqlClient = GraphQL(graphqlConfig);
        return graphqlClient.query({ query: exports.PRODUCT_QUERY(args, cmsContext) }).then(x => x.data.product);
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
}
exports.fetchProduct = fetchProduct;
async function fetchProducts(ids, cmsContext, graphqlConfig) {
    try {
        let graphqlClient = GraphQL(graphqlConfig);
        let x = await Promise.all(ids.map(async (prodId) => {
            return await fetchProduct({ id: prodId }, cmsContext, graphqlConfig);
        }));
        return new Promise((resolve, reject) => { resolve(x); });
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
}
exports.fetchProducts = fetchProducts;
async function queryProducts(args, cmsContext, graphqlConfig) {
    args.full = args.full || false;
    let graphqlClient = GraphQL(graphqlConfig);
    try {
        return graphqlClient.query({ query: exports.CATEGORY_QUERY(args, cmsContext) }).then(x => x.data.category);
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
}
exports.queryProducts = queryProducts;
async function searchProducts(args, cmsContext, graphqlConfig) {
    try {
        let graphqlClient = GraphQL(graphqlConfig);
        return graphqlClient.query({ query: exports.PRODUCTS_QUERY(args, cmsContext) }).then(x => x.data.products.results);
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
}
exports.searchProducts = searchProducts;
__exportStar(require("./types"), exports);
// import { Category, Product, Prices, ProductImage, ResultsMeta, ProductResults, CategoryResults, Attribute, Variant } from './types'
// export { Category, Product, Prices, ProductImage, ResultsMeta, ProductResults, CategoryResults, Attribute, Variant }
// module.exports = { 
//     CATEGORY_HIERARCHY_QUERY, 
//     CATEGORY_QUERY, 
//     PRODUCTS_QUERY, 
//     PRODUCT_QUERY,
//     fetchProduct,
//     Category,
//     Product
// }

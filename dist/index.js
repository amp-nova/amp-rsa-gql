"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchProduct = void 0;
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
        prices {
            list
        }
        images {
            url
        }
    }
`;
const CATEGORY_HIERARCHY_QUERY = gql `    
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
const PRODUCTS_QUERY = args => gql `
    query productsQuery {
        ${args.keyword ? `products(keyword:"${args.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`;
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
const CATEGORY_QUERY = args => gql `
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
        }
    }
`;
async function fetchProduct(args, cmsContext, graphqlConfig) {
    try {
        let graphqlClient = GraphQL(graphqlConfig);
        return graphqlClient.query({ query: PRODUCT_QUERY(args, cmsContext) }).then(x => x.data.product);
    }
    catch (e) {
        console.error(`Error: ${e}`);
    }
}
exports.fetchProduct = fetchProduct;
const types_1 = require("./types");
module.exports = {
    CATEGORY_HIERARCHY_QUERY,
    CATEGORY_QUERY,
    PRODUCTS_QUERY,
    PRODUCT_QUERY,
    fetchProduct,
    Category: types_1.Category,
    Product: types_1.Product
};

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
exports.searchProducts = exports.queryProducts = exports.fetchAllProducts = exports.fetchProduct = exports.CATEGORY_QUERY = exports.PRODUCT_QUERY = exports.PRODUCTS_QUERY = exports.CATEGORY_HIERARCHY_QUERY = void 0;
require("reflect-metadata");
const { gql } = require('@apollo/client/core');
// const GraphQL = require('./graphql-client')
const graphql_client_1 = __importDefault(require("./graphql-client"));
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
const PRODUCTS_QUERY = (gqlc) => {
    var _a, _b;
    return gql `
    query productsQuery {
        ${((_a = gqlc.args) === null || _a === void 0 ? void 0 : _a.keyword) ? `products(keyword:"${(_b = gqlc.args) === null || _b === void 0 ? void 0 : _b.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`;
};
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
const PRODUCT_QUERY = (gqlc) => gql `
    query productQuery {
        product(${lookupArgs(gqlc.args)}) {
            ${productFields}
        }
    }
`;
exports.PRODUCT_QUERY = PRODUCT_QUERY;
const CATEGORY_QUERY = (gqlc) => gql `
    query categoryQuery {
        category(${lookupArgs(gqlc.args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`;
exports.CATEGORY_QUERY = CATEGORY_QUERY;
async function fetchProduct(gqlc) {
    return graphql_client_1.default(gqlc.graphqlConfig).query({ query: exports.PRODUCT_QUERY(gqlc) }).then(x => x.data.product);
}
exports.fetchProduct = fetchProduct;
async function fetchAllProducts(gqlc) {
    return graphql_client_1.default(gqlc.graphqlConfig).query({ query: exports.PRODUCTS_QUERY(gqlc) }).then(x => x.data.products);
}
exports.fetchAllProducts = fetchAllProducts;
// export async function fetchProducts(ids: String[], cmsContext?: CmsContext, graphqlConfig?: GraphqlConfig): Promise<any> {
//     try {
//         let graphqlClient = GraphQL(graphqlConfig)
//         let x = await Promise.all(ids.map(async prodId => {
//             return await fetchProduct({ id: prodId }, cmsContext, graphqlConfig)
//         }))
//         return new Promise((resolve, reject) => { resolve(x) })
//     }
//     catch (e) {
//         console.error(`Error: ${e}`)
//     }
// }
async function queryProducts(gqlc) {
    gqlc.args.full = gqlc.args.full || false;
    return graphql_client_1.default(gqlc.graphqlConfig).query({ query: exports.CATEGORY_QUERY(gqlc) }).then(x => x.data.category);
}
exports.queryProducts = queryProducts;
async function searchProducts(gqlc) {
    return graphql_client_1.default(gqlc.graphqlConfig).query({ query: exports.PRODUCTS_QUERY(gqlc) }).then(x => x.data.products.results);
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

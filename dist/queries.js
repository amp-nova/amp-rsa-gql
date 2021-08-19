"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryQuery = exports.productQuery = exports.productsQuery = exports.categoryHierarchyQuery = void 0;
const { gql } = require('@apollo/client/core');
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
exports.categoryHierarchyQuery = gql `    
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
const productsQuery = (args) => gql `
    query productsQuery {
        ${(args === null || args === void 0 ? void 0 : args.keyword) ? `products(keyword:"${args === null || args === void 0 ? void 0 : args.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`;
exports.productsQuery = productsQuery;
const productQuery = (args) => gql `
    query productQuery {
        product(${lookupArgs(args)}) {
            ${productFields}
        }
    }
`;
exports.productQuery = productQuery;
const categoryQuery = (args) => gql `
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`;
exports.categoryQuery = categoryQuery;

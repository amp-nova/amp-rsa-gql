const { gql } = require('@apollo/client/core');
import { GetProductsArgs, GetProductArgs, GetCategoryArgs } from './types'

const lookupArgs = args => {
    if (args.id) {
        return `id:"${args.id}"`
    }
    else if (args.sku) {
        return `sku:"${args.sku}"`
    }
    else if (args.slug) {
        return `slug:"${args.slug}"`
    }
    else {
        throw new Error("id, sku, or slug must be specified")
    }
}

const commonFields = `
    id
    name
    slug
`

const meta = `
    meta {
        total
        limit
        count
        offset
    }
`

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
`

export const categoryHierarchyQuery = gql`    
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
`

export const productsQuery = (args?: GetProductsArgs) => gql`
    query productsQuery {
        ${args?.keyword ? `products(keyword:"${args?.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`

export const productQuery = (args: GetProductArgs) => gql`
    query productQuery {
        product(${lookupArgs(args)}) {
            ${productFields}
        }
    }
`

export const categoryQuery = (args: GetCategoryArgs) => gql`
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`
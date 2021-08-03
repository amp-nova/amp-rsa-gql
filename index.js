const { gql } = require('@apollo/client/core');

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
        prices {
            list
        }
        images {
            url
        }
    }
`

const CATEGORY_HIERARCHY_QUERY = gql`    
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

const PRODUCTS_QUERY = args => gql`
    query productsQuery {
        ${args.keyword ? `products(keyword:"${args.keyword}")` : `products`} {
            ${meta}
            results {
                ${productFields}
            }
        }
    }
`

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

const PRODUCT_QUERY = args => gql`
    query productQuery {
        product(${lookupArgs(args)}) {
            ${productFields}
        }
    }
`

const CATEGORY_QUERY = args => gql`
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
        }
    }
`

module.exports = { CATEGORY_HIERARCHY_QUERY, CATEGORY_QUERY, PRODUCTS_QUERY, PRODUCT_QUERY }
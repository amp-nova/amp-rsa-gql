import "reflect-metadata"

const { gql } = require('@apollo/client/core');
const GraphQL = require('./graphql-client')

import { GraphqlConfig, CmsContext } from './types'

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

export const CATEGORY_HIERARCHY_QUERY = gql`    
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

export const PRODUCTS_QUERY = (args, context) => gql`
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

export const PRODUCT_QUERY = (args, context) => gql`
    query productQuery {
        product(${lookupArgs(args)}) {
            ${productFields}
        }
    }
`

export const CATEGORY_QUERY = (args, context) => gql`
    query categoryQuery {
        category(${lookupArgs(args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`

export async function fetchProduct(args: any, cmsContext: CmsContext, graphqlConfig: GraphqlConfig): Promise<any> {
    try {
        let graphqlClient = GraphQL(graphqlConfig)
        return graphqlClient.query({ query: PRODUCT_QUERY(args, cmsContext) }).then(x => x.data.product)
    }
    catch (e) {
        console.error(`Error: ${e}`)
    }
}

export async function fetchProducts(ids: String[], cmsContext: CmsContext, graphqlConfig: GraphqlConfig): Promise<any> {
    try {
        let graphqlClient = GraphQL(graphqlConfig)
        let x = await Promise.all(ids.map(async prodId => {
            return await fetchProduct({ id: prodId }, cmsContext, graphqlConfig)
        }))

        return new Promise((resolve, reject) => { resolve(x) })
    }
    catch (e) {
        console.error(`Error: ${e}`)
    }
}

export async function queryProducts(args: any, cmsContext: CmsContext, graphqlConfig: GraphqlConfig): Promise<any> {
    args.full = args.full || false
    let graphqlClient = GraphQL(graphqlConfig)
    try {
        return graphqlClient.query({ query: CATEGORY_QUERY(args, cmsContext) }).then(x => x.data.category)
    }
    catch (e) {
        console.error(`Error: ${e}`)
    }
}

export async function searchProducts(args: any, cmsContext: CmsContext, graphqlConfig: GraphqlConfig): Promise<any> {
    try {
        let graphqlClient = GraphQL(graphqlConfig)
        return graphqlClient.query({ query: PRODUCTS_QUERY(args, cmsContext) }).then(x => x.data.products.results)
    }
    catch (e) {
        console.error(`Error: ${e}`)
    }
}

export * from './types'

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
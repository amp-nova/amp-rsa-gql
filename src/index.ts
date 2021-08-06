import "reflect-metadata"

const { gql } = require('@apollo/client/core');
// const GraphQL = require('./graphql-client')

import GraphQL from './graphql-client'
import { GraphqlConfig, CmsContext, GraphQLQueryConfig, GetProductsArgs, GetProductArgs, ProductResults } from './types'

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

export const PRODUCTS_QUERY = (gqlc: GraphQLQueryConfig) => gql`
    query productsQuery {
        ${gqlc.args?.keyword ? `products(keyword:"${gqlc.args?.keyword}")` : `products`} {
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

export const PRODUCT_QUERY = (gqlc: GraphQLQueryConfig) => gql`
    query productQuery {
        product(${lookupArgs(gqlc.args)}) {
            ${productFields}
        }
    }
`

export const CATEGORY_QUERY = (gqlc: GraphQLQueryConfig) => gql`
    query categoryQuery {
        category(${lookupArgs(gqlc.args)}) {
            ${commonFields}
            products {
                ${productFields}
            }
        }
    }
`

export async function fetchProduct(gqlc: GraphQLQueryConfig): Promise<any> {
    return GraphQL(gqlc.graphqlConfig).query({ query: PRODUCT_QUERY(gqlc) }).then(x => x.data.product)
}

export async function fetchAllProducts(gqlc: GraphQLQueryConfig): Promise<ProductResults> {
    return GraphQL(gqlc.graphqlConfig).query({ query: PRODUCTS_QUERY(gqlc) }).then(x => x.data.products)
}

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

export async function queryProducts(gqlc: GraphQLQueryConfig): Promise<any> {
    gqlc.args.full = gqlc.args.full || false
    return GraphQL(gqlc.graphqlConfig).query({ query: CATEGORY_QUERY(gqlc) }).then(x => x.data.category)
}

export async function searchProducts(gqlc: GraphQLQueryConfig): Promise<any> {
    return GraphQL(gqlc.graphqlConfig).query({ query: PRODUCTS_QUERY(gqlc) }).then(x => x.data.products.results)
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
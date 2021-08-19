import "reflect-metadata"

import GraphQL from './graphql-client'
import { GraphqlConfig, GetProductsArgs, GetProductArgs, ProductResults, Product, Category, GetCategoryArgs } from './types'
import { productsQuery, productQuery, categoryQuery, categoryHierarchyQuery } from './queries'

export * from './types'

export default function(graphqlConfig: GraphqlConfig): GraphQLClient {
    let client = GraphQL(graphqlConfig)

    return {
        fetchAllProducts: async function(args?: GetProductsArgs): Promise<ProductResults> {
            return (await client.query({ query: productsQuery(args) })).data.products
        },
        fetchProduct: async function(args: GetProductArgs): Promise<Product> {
            return (await client.query({ query: productQuery(args) })).data.product
        },
        fetchCategoryHierarchy: async function(): Promise<[Category]> {
            return (await client.query({ query: categoryHierarchyQuery })).data.categoryHierarchy
        },
        fetchCategory: async function(args: GetCategoryArgs): Promise<Category> {
            return (await client.query({ query: categoryQuery(args) })).data.category
        }
    }
}

export type GraphQLClient = {
    fetchAllProducts(args?: GetProductsArgs)
    fetchProduct(args: GetProductArgs)
    fetchCategoryHierarchy()
    fetchCategory(args: GetCategoryArgs): Promise<Category>
}
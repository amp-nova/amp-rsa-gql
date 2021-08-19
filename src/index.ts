import "reflect-metadata"

import GraphQL from './graphql-client'
import { GraphqlConfig, GetProductsArgs, GetProductArgs, ProductResults, Product, Category, GetCategoryArgs, GraphQLQueryConfig } from './types'
import { productsQuery, productQuery, categoryQuery, categoryHierarchyQuery } from './queries'

export * from './types'

export default function(graphqlConfig: GraphqlConfig): GraphQLClient {
    let client = GraphQL(graphqlConfig)

    return {
        fetchAllProducts: async function(config: GraphQLQueryConfig): Promise<ProductResults> {
            return (await client.query({ query: productsQuery(config.args) })).data.products
        },
        fetchProduct: async function(args: GetProductArgs): Promise<Product> {
            return (await client.query({ query: productQuery(args) })).data.product
        },
        fetchCategoryHierarchy: async function(): Promise<[Category]> {
            return (await client.query({ query: categoryHierarchyQuery })).data.categoryHierarchy
        },
        fetchCategory: async function(config: GraphQLQueryConfig): Promise<Category> {
            return (await client.query({ query: categoryQuery(config.args) })).data.category
        }
    }
}

export type GraphQLClient = {
    fetchAllProducts(config: GraphQLQueryConfig)
    fetchProduct(args: GetProductArgs)
    fetchCategoryHierarchy()
    fetchCategory(config: GraphQLQueryConfig): Promise<Category>
}
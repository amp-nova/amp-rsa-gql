import "reflect-metadata";
import { GraphqlConfig, GetProductArgs, Category, GraphQLQueryConfig } from './types';
export * from './types';
export default function (graphqlConfig: GraphqlConfig): GraphQLClient;
export declare type GraphQLClient = {
    fetchAllProducts(config: GraphQLQueryConfig): any;
    fetchProduct(args: GetProductArgs): any;
    fetchCategoryHierarchy(): any;
    fetchCategory(config: GraphQLQueryConfig): Promise<Category>;
};

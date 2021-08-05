import { GraphqlConfig, CmsContext } from './types';
export declare const CATEGORY_HIERARCHY_QUERY: any;
export declare const PRODUCTS_QUERY: (args: any) => any;
export declare const PRODUCT_QUERY: (args: any, context: any) => any;
export declare const CATEGORY_QUERY: (args: any) => any;
export declare function fetchProduct(args: any, cmsContext: CmsContext, graphqlConfig: GraphqlConfig): Promise<any>;
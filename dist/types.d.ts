export declare class Prices {
    sale?: string;
    list?: string;
}
export declare class ProductImage {
    url: string;
}
export declare class ResultsMeta {
    limit: number;
    offset: number;
    count: number;
    total: number;
}
export declare class ProductResults {
    meta: ResultsMeta;
    results: [Product];
}
export declare class CategoryResults {
    meta: ResultsMeta;
    results: [Category];
}
export declare class Identifiable {
    id: string;
}
export declare class CommerceObject extends Identifiable {
    slug: string;
    name: string;
    raw: string;
}
export declare class Product extends CommerceObject {
    shortDescription?: string;
    longDescription?: string;
    categories: Category[];
    variants: Variant[];
    productType: string;
}
export declare class Attribute {
    name: string;
    value: string;
}
export declare class Variant extends Identifiable {
    sku: string;
    prices: Prices;
    defaultImage?: ProductImage;
    images: ProductImage[];
    attributes: Attribute[];
    color?: string;
    size?: string;
    articleNumberMax?: string;
}
export declare class Category extends CommerceObject {
    children: Category[];
    products: Product[];
}
export declare class SearchResult {
    products: Product[];
}
export declare type CmsContext = {
    contentApi: string;
    stagingApi?: string;
    locale?: string;
    currency?: string;
    timestamp?: number;
};
export declare type UserContext = {
    userId?: string;
    sessionId?: string;
    language: string;
    country: string;
    currency: string;
    segment?: string;
    targetingTags: string[];
    targetingBehaviors: string[];
    dyApiPreview: string | null;
};
export declare type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
};
export declare type GraphQLQueryConfig = {
    cmsContext?: CmsContext;
    userContext?: UserContext;
    args?: any;
};
export declare class CommonArgs {
    locale?: string;
    currency?: string;
}
export declare class ListArgs extends CommonArgs {
    limit?: number;
    offset?: number;
}
export declare class Context {
    backendKey: string;
    commercehub: any;
}
export declare class GetCategoryArgs extends CommonArgs {
    id?: string;
    slug?: string;
}
export declare class GetCategoryProductArgs extends CommonArgs {
    full?: boolean;
    customerSegment?: string;
}
export declare class GetProductsArgs extends ListArgs {
    keyword?: string;
    customerSegment?: string;
}
export declare class GetProductArgs extends CommonArgs {
    id?: string;
    sku?: string;
    slug?: string;
    customerSegment?: string;
}
export declare class GetAttributeArgs {
    name: string;
}

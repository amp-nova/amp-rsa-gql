export declare class Prices {
    sale: string;
    list: string;
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
    shortDescription: string;
    longDescription: string;
    categories: Category[];
    variants: Variant[];
}
export declare class Attribute {
    name: string;
    value: string;
}
export declare class Variant extends Identifiable {
    sku: string;
    prices: Prices;
    defaultImage: ProductImage;
    images: ProductImage[];
    attributes: Attribute[];
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
export declare type GraphqlConfig = {
    graphqlUrl: string;
    backendKey: string;
};

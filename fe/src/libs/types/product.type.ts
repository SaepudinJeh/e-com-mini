export type ProductDataType = {
    data: ProductType[];
}
export type ProductDetailType = {
    data: ProductType
}

export type ProductType = {
    id:          number;
    name:        string;
    description: string;
    price:       number;
    image:       string;
    createdAt?:   Date;
    deletedAt?:   null;
}
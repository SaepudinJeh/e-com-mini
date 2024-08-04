export type CreateProductType = {
    name: string;
    description: string;
    price: number;
    image: string;
}

export type UpdateProductType = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}
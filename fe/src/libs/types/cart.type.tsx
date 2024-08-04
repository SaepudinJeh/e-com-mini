import { ProductType } from "./product.type";

export type CartDataType = {
    data: CartType[]
}

export type CartItemType = {
    data: CartType
}

export type CartType = {
    id: number;
    quantity: number;
    product: ProductType
}
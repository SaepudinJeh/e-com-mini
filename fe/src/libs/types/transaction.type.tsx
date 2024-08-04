type Item = {
    name: string;
    price: number;
    cartId: number;
    quantity: number;
    productId: number;
};

export type TransactionOrderType = {
    id: number;
    userId: number;
    orderId: string;
    items: Item[];
    gross_amount: number;
    status: string;
    customer_name: string;
    customer_email: string;
    snap_token: string;
    snap_redirect_url: string;
    payment_method: string | null;
    created_at: string;
    updated_at: string;
};

export type TransactionDataType = {
    data: TransactionOrderType[]
};
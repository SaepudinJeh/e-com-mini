export type ResponeCheckoutType = {
    data: {
        token: string;
        redirect_url: string;
        orderId: string;
    }
}
import { z, ZodType } from "zod";

export class CartValidation {
    static addToCartSchema: ZodType = z.object({
        productId: z.number(),
        quantity: z.number(),
    });

    static updateCartSchema: ZodType = z.object({
        quantity: z.number(),
    });

}
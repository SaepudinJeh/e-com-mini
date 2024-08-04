import { z, ZodType } from 'zod';

export class ProductValidation {
    static create: ZodType = z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        image: z.string(),
    });

    static update: ZodType = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        image: z.string().optional(),
    });
}
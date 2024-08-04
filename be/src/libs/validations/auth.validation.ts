import { ZodType, z } from 'zod';

export class AuthValidation {
    static Login: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(3),
    }).required({ email: true, password: true })

    static Register: ZodType = z.object({
        username: z.string(),
        email: z.string().email(),
        password: z.string().min(3),
    }).required({ email: true, password: true })
}
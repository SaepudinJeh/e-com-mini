import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
    async getAllCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.getCustomers();
            res.status(200).json({ data: result });
        } catch (error) {
            return next(error)
        }
    }

    async getAllTransactionUser(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await userService.transactionsUser();
            res.status(200).json({ data: result });
        } catch (error) {
            return next(error)
        }
    }
}
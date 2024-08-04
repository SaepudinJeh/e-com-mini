import {Response, Request, NextFunction} from "express";
import {ZodError} from "zod";
import { CustomError } from "../libs/handlers/error.handler";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            errors: JSON.stringify(error)
        });
    } else if (error instanceof CustomError) {
        res.status(error.statusCode).json({
            errors: error.message
        });
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
}

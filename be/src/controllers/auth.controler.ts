import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserLogin, UserType } from '../libs/types/user.type';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username } = req.body as UserType;
      const result = await authService.register({ email, password, username });
      res.status(201).json({data: result});
    } catch (error) {
      return next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as UserLogin;
      const result = await authService.login(payload);
      res.status(200).json({data: result});
    } catch (error) {
      return next(error)
    }
  }
}

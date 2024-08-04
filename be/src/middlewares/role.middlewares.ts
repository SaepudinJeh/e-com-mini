import { Request, Response, NextFunction } from 'express';
import { UserRequest } from '../libs/types/user_request.type';

export class RoleMiddleware {
  static authorize(roles: string[]) {
    return (req: UserRequest, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user!.role!)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    };
  }
}

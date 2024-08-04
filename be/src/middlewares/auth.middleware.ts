import { Response, NextFunction } from 'express';
import { JwtUtils } from '../libs/utils/jwt.util';
import { UserRequest } from '../libs/types/user_request.type';
import { PrismaClient } from '@prisma/client';

export class AuthMiddleware {
  static async authenticate(req: UserRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const decoded = JwtUtils.verifyToken(token) as any;

      if (!decoded?.sub) res.status(401).json({ error: 'Unauthorized' });

      const prisma = new PrismaClient();

      const user = await prisma.user.findFirst({
        where: {
          email: decoded?.sub
        }
      });

      if (user) {
        req.user = user;
        next();
        return;
      }

    } catch (error) {
      console.log(error);
      
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

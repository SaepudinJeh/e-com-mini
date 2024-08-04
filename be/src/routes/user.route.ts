import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middlewares';

const router = Router();
const trxControllers = new UserController();

router.get('/',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']),
    trxControllers.getAllCustomers
);

router.get('/orders',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']),
    trxControllers.getAllTransactionUser
);

export default router;
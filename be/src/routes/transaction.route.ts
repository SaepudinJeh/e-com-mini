import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TransactionController } from '../controllers/transaction.controller';
import { RoleMiddleware } from '../middlewares/role.middlewares';

const router = Router();
const transactionController = new TransactionController();

router.post('/checkout', AuthMiddleware.authenticate, RoleMiddleware.authorize(['user']), transactionController.checkout);
router.get('/history', AuthMiddleware.authenticate, RoleMiddleware.authorize(['user']), transactionController.getTransactionHistory);
router.get('/:id', AuthMiddleware.authenticate, RoleMiddleware.authorize(['user']), transactionController.getTransactionDetail);

export default router;

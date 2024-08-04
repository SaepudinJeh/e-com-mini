import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CartController } from '../controllers/cart.controller';
import { RoleMiddleware } from '../middlewares/role.middlewares';

const router = Router();
const cartController = new CartController();

router.post(
  '/',
  AuthMiddleware.authenticate,
  RoleMiddleware.authorize(['user']),
  cartController.addToCart
);

router.get(
    '/',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['user']),
    cartController.getUserCart
);

router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['user']),
    cartController.deleteCartItem
);

export default router;

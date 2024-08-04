import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middlewares';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

router.post(
    '/',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']),
    productController.createProduct
);

router.put(
    '/',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']),
    productController.updateProduct
);

router.delete(
    '/:id',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']),
    productController.deleteProduct
);

router.get(
    '/', 
    // AuthMiddleware.authenticate,
    // RoleMiddleware.authorize(['admin']),
    productController.getAllProducts
);

router.get(
    '/:id',
    AuthMiddleware.authenticate,
    RoleMiddleware.authorize(['admin']), 
    productController.getProduct
);

export default router;

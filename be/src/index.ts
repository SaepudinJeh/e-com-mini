import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";

import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import cartsRoutes from "./routes/cart.route";
import userRoute from "./routes/user.route";
import transactionRoutes from "./routes/transaction.route";
import { AuthMiddleware } from './middlewares/auth.middleware';
import { RoleMiddleware } from './middlewares/role.middlewares';
import { errorMiddleware } from './middlewares/error.middleware';


const app = express();
app.use(cors({
  origin: "*"
}))
const prisma = new PrismaClient();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartsRoutes);
app.use('/transactions', transactionRoutes);
app.use('/user', userRoute);

app.get('/admin', AuthMiddleware.authenticate, RoleMiddleware.authorize(['admin']), (req, res) => {
  res.send('Admin content');
});

app.get('/user', AuthMiddleware.authenticate, RoleMiddleware.authorize(['user', 'admin']), (req, res) => {
  res.send('User content');
});

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

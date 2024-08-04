import { PrismaClient } from '@prisma/client';
import { CreateCartType } from '../libs/types/cart.types';
import { Validation } from '../libs/validations/index.validation';
import { CartValidation } from '../libs/validations/cart.validation';

const prisma = new PrismaClient();

export class CartService {
  async addToCart(userId: number, payload: CreateCartType) {
    const validated = Validation.validate(CartValidation.addToCartSchema, payload)

    const existingCart = await prisma.cart.findFirst({
      where: { userId, productId: validated.productId, deletedAt: null },
    });

    if (existingCart) {
      return await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: validated.quantity },
      });
    }

    return await prisma.cart.create({
      data: {
        userId,
        productId: validated.productId,
        quantity: validated.quantity,
      },
    });
  }

//   async updateCart(id: number, data: UpdateCartDTO) {
//     return await prisma.cart.update({
//       where: { id },
//       data,
//     });
//   }

  async getUserCart(userId: number) {
    return await prisma.cart.findMany({
      where: { userId, deletedAt: null },
      include: { product: true },
    });
  }

  async deleteCartItem(id: number) {
    return await prisma.cart.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}

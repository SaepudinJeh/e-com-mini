import { NextFunction, Request, Response } from 'express';
import { CartService } from '../services/cart.service';
import { UserRequest } from '../libs/types/user_request.type';
import { CreateCartType } from '../libs/types/cart.types';

const cartService = new CartService();

export class CartController {
  async addToCart(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data: CreateCartType = req.body;
      const cartItem = await cartService.addToCart(userId, data);
      res.status(201).json({ data: cartItem });
    } catch (error) {
      return next(error)
    }
  }

  async getUserCart(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const cart = await cartService.getUserCart(userId);
      res.status(200).json({ data: cart });
    } catch (error) {
      return next(error)
    }
  }

  async deleteCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await cartService.deleteCartItem(Number(id));
      res.status(204).send();
    } catch (error) {
      return next(error)
    }
  }

//   async updateCart(req: Request, res: Response) {
//     try {
//       const { id } = req.params;
//       const data: UpdateCartDTO = req.body;
//       const cartItem = await cartService.updateCart(Number(id), data);
//       res.status(200).json(cartItem);
//     } catch (error) {
//       return next(error)
//     }
//   }
}

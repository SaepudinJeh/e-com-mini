import { NextFunction, Request, Response } from 'express';
import { CreateProductType, UpdateProductType } from '../libs/types/product.type';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateProductType = req.body;
      const product = await productService.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      return next(error)
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateProductType = req.body;
      const product = await productService.updateProduct(data);
      res.status(200).json(product);
    } catch (error) {
      return next(error)
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await productService.deleteProduct(Number(id));
      res.status(200).send({ data: { message: "delete successfully" } });
    } catch (error) {
      return next(error)
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json({ data: products });
    } catch (error) {
      return next(error)
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await productService.getProduct(Number(id));
      res.status(200).json({ data: product });
    } catch (error) {
      return next(error)
    }
  }
}

import { PrismaClient } from '@prisma/client';
import { CreateProductType, UpdateProductType } from '../libs/types/product.type';
import { Validation } from '../libs/validations/index.validation';
import { ProductValidation } from '../libs/validations/product.validation';

const prisma = new PrismaClient();

export class ProductService {
  async createProduct(payload: CreateProductType) {
    const dataValidated = Validation.validate(ProductValidation.create, payload)

    return await prisma.product.create({
      data: dataValidated,
    });
  }

  async updateProduct(payload: UpdateProductType) {
    const dataValidated = Validation.validate(ProductValidation.update, payload)

    return await prisma.product.update({
      where: { id: payload?.id },
      data: dataValidated,
    });
  }

  async deleteProduct(id: number) {
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  async getAllProducts() {
    return await prisma.product.findMany({ where: { deletedAt: null } });
  }

  async getProduct(id: number) {
    return await prisma.product.findFirst({
      where: { id, deletedAt: null }
    });
  }
}

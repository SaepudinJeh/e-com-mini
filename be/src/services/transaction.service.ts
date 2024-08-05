import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export class TransactionService {

  async checkout(userId: number, customerName: string, customerEmail: string) {
    const cartItems = await prisma.cart.findMany({
      where: { userId, deletedAt: null },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return false;
    }

    const orderId = `ORDER-${new Date().toISOString()}`;

    const lineItems = await Promise.all(cartItems.map(async (item) => {
      const product = await stripe.products.create({
        name: item.product.name,
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: item.product.price * 100, // Stripe expects the amount in the smallest currency unit
        currency: 'idr',
      });

      return {
        price: price.id,
        quantity: item.quantity,
      };
    }));

    const checkout = await stripe.checkout.sessions.create({
      line_items: lineItems,
      currency: 'idr',
      mode: "payment",
      success_url: `${process.env.BASE_URL_FRONTEND!}/transactions`,
      cancel_url: `${process.env.BASE_URL_FRONTEND!}/cart`,
      customer_email: customerEmail,
      metadata: { orderId, wkwkwkw: "wkwkwk" }
    })

    if(!checkout.url) {
      return false
    }
    
    await prisma.transaction.create({
      data: {
        userId,
        orderId,
        items: cartItems.map(item => ({
          cartId: item.id,
          productId: item.productId,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
        gross_amount: checkout?.amount_total!,
        status: checkout?.status! ?? "pending",
        customer_name: customerName,
        customer_email: customerEmail,
        stripe_redirect_url: checkout.url
      },
    });

    // Clear user's cart after creating the transaction
    await prisma.cart.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() }
    });

    return {
      redirect_url: checkout.url,
      // orderId,
    };
  }

  async updatePaymentStatus({orderId, status, payment_method, payment_status }: {orderId: string, status?: string, payment_method?: string, payment_status?: string }) {
    await prisma.transaction.update({
      where: { orderId },
      data: {
        status,
        updated_at: new Date(),
        payment_method,
        payment_status
      },
    });
  }

  async getTransactionHistory(userId: number) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: { updated_at: 'desc' },
    });
  }

  async getTransactionDetail(transactionId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }
}

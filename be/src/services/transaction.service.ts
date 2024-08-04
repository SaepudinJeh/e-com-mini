import { PrismaClient } from '@prisma/client';
import crypto from "crypto";

const prisma = new PrismaClient();

export class TransactionService {

  async checkout(userId: number, customerName: string, customerEmail: string) {
    const cartItems = await prisma.cart.findMany({
      where: { userId, deletedAt: null },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return false
    }

    const gross_amount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const orderId = `ORDER-${new Date().toISOString()}`;

    // Create transaction parameters for Midtrans
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        first_name: customerName,
        email: customerEmail,
      },
      item_details: cartItems.map(item => ({
        id: item.productId.toString(),
        price: item.product.price,
        quantity: item.quantity,
        name: item.product.name,
      })),
      callbacks: {
        finish: `${process.env.BASE_URL_FRONTEND}/transactions`,
        error: `${process.env.BASE_URL_FRONTEND}/transactions`,
        pending: `${process.env.BASE_URL_FRONTEND}/transactions`
      }
    };

    const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`)
  
    const response = await fetch(`${process.env.MIDTRANS_APP_URL!}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(transactionParams)
    });
    

    const data = await response.json();

    if (response?.status !== 201) {
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
        gross_amount,
        status: 'capture',
        customer_name: customerName,
        customer_email: customerEmail,
        snap_token: data?.token,
        snap_redirect_url: data?.redirect_url,
      },
    });

    // Clear user's cart after successful transaction
    await prisma.cart.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() }
    });

    return { ...data, orderId };
  }

  async updatePaymentStatus(orderId: string, status: string, payment_method?: string) {
    await prisma.transaction.updateMany({
      where: {
        orderId,
      },
      data: {
        status,
        updated_at: new Date(),
        payment_method
      },
    });
  }

  async getTransactionHistory(userId: number) {
    return await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        updated_at: 'desc'
      },
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

  async handleMidtransNotification(payload: any) {
    const { order_id, transaction_status, signature_key, payment_method } = payload;
    const  trx = await prisma.transaction.findUnique({
      where: { orderId: order_id },
    });

    const generatedSignatureKey = crypto.createHash('sha512').update(
      `${order_id}${transaction_status}${trx?.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
    ).digest('hex');

    if (generatedSignatureKey !== signature_key) {
      throw new Error('Invalid signature key');
    }

    await this.updatePaymentStatus(order_id, transaction_status, payment_method);
  }
}

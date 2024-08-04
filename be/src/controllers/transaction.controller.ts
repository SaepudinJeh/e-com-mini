import { Request, Response } from 'express';
import { UserRequest } from '../libs/types/user_request.type';
import {TransactionService} from '../services/transaction.service';

const transactionService = new TransactionService();

export class TransactionController {
  async checkout(req: UserRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const email = req.user!.email;
      const username = req.user!.username;
      const result = await transactionService.checkout(userId, username ?? "", email);

      if(!result) res.status(400).json({ error: "Transaction Failed!" });

      res.status(201).json({data: result});
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionHistory(req: UserRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const transactions = await transactionService.getTransactionHistory(userId);
      res.status(200).json({data: transactions});
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransactionDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transactionDetail = await transactionService.getTransactionDetail(Number(id));
      res.status(200).json({data: transactionDetail});
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { order_id, transaction_status } = req.body;
      await transactionService.updatePaymentStatus(order_id, transaction_status);
      res.status(200).json({ message: 'Payment status updated' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async handleMidtransNotification(req: Request, res: Response) {
    try {
      const { order_id, transaction_status } = req.body;
      console.log("runninnggg");
      
      console.log(req.body);
      
      await transactionService.updatePaymentStatus(order_id, transaction_status);
      res.status(200).json({ message: 'Payment status updated' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

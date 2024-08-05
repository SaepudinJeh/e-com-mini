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
}

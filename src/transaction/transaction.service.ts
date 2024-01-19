import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../billing/model/account.model';
import { Transaction } from './model/transaction.model';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async processTransaction(accountId: string, amount: number, type: string): Promise<Transaction> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    let status = 'completed';
    if (type === 'debit' && account.balance < amount) {
      status = 'pending';
    }

    const transaction = new this.transactionModel({ accountId, amount, type, status });
    await transaction.save();

    if (status === 'completed') {
      if (type === 'debit') {
        account.balance -= amount;
      } else if (type === 'credit') {
        account.balance += amount;
      }
      await account.save();
    }

    return transaction;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/transaction/model/transaction.model';
import { Account } from 'src/billing/model/account.model';
import { User } from 'src/user/models/user.model';
import { Currency } from 'src/constants';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async createAccount(userId: string, currency: Currency = Currency.RUR): Promise<Account> {
    const account = new this.accountModel({ userId, currency });
    return await account.save();
  }

  async updateAccount(
    accountId: string,
    updateParams: { companyDetails?: any; cardId?: any },
    b2bPaymentInfo?: { invoiceId: string; closingDocuments: any[] },
  ): Promise<Account> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Update account details based on the provided parameters
    if (updateParams.companyDetails) {
      account.companyDetails = updateParams.companyDetails;
    }

    if (updateParams.cardId) {
      account.cardId = updateParams.cardId;
    }

    // Check if B2B payment info is provided
    if (b2bPaymentInfo) {
      // Process B2B payment logic, e.g., fetch closing documents from accounting software
      console.log(`Fetching closing documents for Invoice ID: ${b2bPaymentInfo.invoiceId}`);
      console.log('Closing documents:', b2bPaymentInfo.closingDocuments);

      // Additional logic related to B2B payments can be added here
    }

    // Save the updated account details
    await account.save();

    return account;

  }

  async chargeAccount(userId: string, amount: number, description: string): Promise<Transaction> {
    const account = await this.accountModel.findOne({ userId, balance: { $gte: amount } });
    if (!account) {
      throw new NotFoundException('Insufficient funds or account not found');
    }

    const transaction = new this.transactionModel({
      accountId: account._id,
      amount: -amount, // Negative amount denotes a debit transaction
      type: 'debit',
      status: 'completed',
      description,
    });

    // Update account balance
    account.balance -= amount;
    await Promise.all([transaction.save(), account.save()]);

    return transaction;
  }

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
      } 
      if (type === 'credit') {
        account.balance += amount;
      }
      await account.save();
    }

    return transaction;
  }

  async getAccountBalance(accountId: string): Promise<number> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.balance;
  }
}

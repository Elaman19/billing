import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from '../account/model/account.model';
import { Invoice } from './model/invoice.model';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(accountId: string, amount: number): Promise<Invoice> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const invoice = new this.invoiceModel({ accountId, amount });
    await invoice.save();

    // Update account details, for example, marking the invoice as sent
    // account.lastInvoiceDate = invoice.createdAt;
    // await account.save();

    // Notify the accounting system (This is a placeholder, replace it with your actual notification mechanism)
    this.notifyAccountingSystem(invoice);

    return invoice;
  }

  private notifyAccountingSystem(invoice: Invoice): void {
    // Your logic for notifying the accounting system goes here
    console.log(`Notification sent to accounting system for Invoice ID: ${invoice._id}`);
  }
}
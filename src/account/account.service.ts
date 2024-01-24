import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/transaction/model/transaction.model';
import { Account } from 'src/account/model/account.model';
import { Currency } from 'src/constants';
import { User } from 'src/user/model/user.model';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async getAll(){
    return await this.accountModel.find({})
  }

  async create(
    userId: string, 
    currency: Currency = Currency.RUR
  ): Promise<Account> {
    const account = new this.accountModel({ userId, currency });
    return await account.save();
  }

  async update(dto: UpdateAccountDto): Promise<Account> {
    const account = await this.accountModel.findById(dto.accountId);
    if (!account) 
      throw new NotFoundException('Account not found');

    if (dto.companyDetails) 
      account.companyDetails = dto.companyDetails;

    if (dto.cardId) 
      account.cardId = dto.cardId;

    await account.save();
    return account;
  }

  // Сценарий валидации счета B2C - пополнение мгновенно через эквайринг.
  async validate(accountId: string): Promise<string>{
    const account = await this.accountModel.findById(accountId)
    if (!account)
      throw new BadRequestException('Account not found')

    const user = await this.userModel.findById(account.userId)
    if (!user)
      throw new BadRequestException('User not found')

    return user.username
  }
  // Сценарий пополнения счета B2C - пополнение мгновенно через эквайринг.
  async repleinish(accountId: string, amount: number){
    const account = await this.accountModel.findById(accountId)
    if (!account)
      throw new BadRequestException('Account not found')

    account.balance += amount;

    const transaction = new this.transactionModel({
      accountId: account._id,
      amount: amount, 
      type: 'credit',
      status: 'completed'
    });

    // Update account balance
    account.balance += amount;
    await Promise.all([transaction.save(), account.save()]);

    return transaction
  }

  // Сценарий списывания со счета
  async withdraw(
    userId: string, 
    amount: number, 
    description: string
  ): Promise<Transaction> {
    const account = await this.accountModel.findOne({ userId });
    if (!account) 
      throw new NotFoundException('Account not found');
    
    if (account.balance < amount)
      throw new NotFoundException('Unsufficient fund in balance')

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

  async getBalance(accountId: string): Promise<number> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.balance;
  }
}

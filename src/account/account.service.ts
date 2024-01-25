import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from 'src/transaction/model/transaction.model';
import { Account, AccountDocument } from 'src/account/model/account.model';
import { User } from 'src/user/model/user.model';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { RepleinishAccountDto } from './dto/repleinish-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';

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

  async create(dto: CreateAccountDto): Promise<AccountDocument> {
    if (!dto.userId){
      const account = new this.accountModel({userId: 'asdf'});
      return await account.save();
    }
    const account = new this.accountModel(dto);
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
  async validate(accountId: Types.ObjectId): Promise<string>{
    const account = await this.accountModel.findById(accountId)
    if (!account)
      throw new BadRequestException('Account not found')

    const user = await this.userModel.findById(account.userId)
    if (!user)
      throw new BadRequestException('User not found')

    return user.username
  }
  // Сценарий пополнения счета B2C - пополнение мгновенно через эквайринг.
  async repleinish(dto: RepleinishAccountDto){
    const account = await this.accountModel.findById(dto.accountId)
    if (!account)
      throw new BadRequestException('Account not found')

    account.balance += dto.amount;

    const transaction = new this.transactionModel({
      accountId: account._id,
      amount: dto.amount, 
      type: 'credit',
      status: 'completed'
    });

    // Update account balance
    account.balance += dto.amount;
    await Promise.all([transaction.save(), account.save()]);

    return transaction
  }

  // Сценарий списывания со счета
  async withdraw(dto: WithdrawAccountDto): Promise<Transaction> {
    const account = await this.accountModel.findById(dto.accountId);
    if (!account) 
      throw new NotFoundException('Account not found');
    
    if (account.balance < dto.amount)
      throw new NotFoundException('Unsufficient fund in balance')

    const transaction = new this.transactionModel({
      accountId: account._id,
      amount: -dto.amount, // Negative amount denotes a debit transaction
      type: 'debit',
      status: 'completed',
      description: '',
    });

    // Update account balance
    account.balance -= dto.amount;
    await Promise.all([transaction.save(), account.save()]);

    return transaction;
  }

  async getBalance(accountId: Types.ObjectId): Promise<number> {
    const account = await this.accountModel.findById(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account.balance;
  }
}

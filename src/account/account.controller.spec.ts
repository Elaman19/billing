import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UserController } from 'src/user/user.controller';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Mongoose, Types } from 'mongoose';
import { RepleinishAccountDto } from './dto/repleinish-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AccountModule } from './account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/model/user.model';
import { Account, AccountSchema } from './model/account.model';
import { Transaction, TransactionSchema } from 'src/transaction/model/transaction.model';
import { UserService } from 'src/user/user.service';

describe('AccountController', () => {
  let accountService: AccountService
  let accountController: AccountController
  let userController: UserController
  let transactionService: TransactionService
  let accountId: Types.ObjectId
  let userId: Types.ObjectId

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [
          MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
                                    { name: Account.name, schema: AccountSchema },
                                    { name: Transaction.name, schema: TransactionSchema}]),
        ],
        controllers: [AccountController, UserController],
        providers: [AccountService, UserService, TransactionService],
      }).compile();

    accountService = moduleRef.get<AccountService>(AccountService);
    accountController = moduleRef.get<AccountController>(AccountController);
    userController = moduleRef.get<UserController>(UserController)
    transactionService = moduleRef.get<TransactionService>(TransactionService)
  });

  it('should create a user and account', async () => {
    const dto: CreateUserDto = {username: "John Doe",email: "test@gmail.com", password: "QWErty12345"}
    const user = await userController.register(dto)
    userId = user._id
    accountId = user.accounts[0]
    expect(userId).toBeInstanceOf(Types.ObjectId)
    expect(accountId).toBeInstanceOf(Types.ObjectId)
  });

  // it('should be more than 0 (account counts)', async () => {
  //   const accounts = await accountController.getAll()
  //   expect(accounts.length).toBeGreaterThan(0)
  // });

  // it('should repleinish to account balance', async () => {
  //   const balance = await accountController.getBalance(accountId)
  //   const amount = 100
  //   const dto: RepleinishAccountDto = {accountId, amount}
  //   await accountController.repleinish(dto)
  //   const newBalance = await accountController.getBalance(accountId)
  //   expect(balance+amount).toBe(newBalance)
  // });

  // it('should withdraw from account balance', async () => {
  //   const balance = await accountController.getBalance(accountId)
  //   const amount = 50
  //   const dto: WithdrawAccountDto = {accountId, amount}
  //   await accountController.withdraw(dto)
  //   const newBalance = await accountController.getBalance(accountId)
  //   expect(balance - amount).toBe(newBalance)
  // });
});
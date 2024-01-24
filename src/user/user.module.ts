import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { Account, AccountSchema } from 'src/account/model/account.model';
import { Transaction, TransactionSchema } from 'src/transaction/model/transaction.model';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, 
                               { name: Account.name, schema: AccountSchema },
                               { name: Transaction.name, schema: TransactionSchema}]),
    AccountModule,
  ],
  providers: [UserService, AccountService],
  controllers: [UserController]
})
export class UserModule {}
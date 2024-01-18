import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/models/user.model';
import { Account, AccountSchema } from './model/account.model';
import { Transaction, TransactionSchema } from 'src/transaction/model/transaction.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
                               { name: Account.name, schema: AccountSchema },
                               { name: Transaction.name, schema: TransactionSchema}]),
  ],
  providers: [BillingService]
})
export class BillingModule {}

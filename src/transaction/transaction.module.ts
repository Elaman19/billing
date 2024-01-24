import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/account/model/account.model';
import { Transaction, TransactionSchema } from './model/transaction.model';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema },
                               { name: Transaction.name, schema: TransactionSchema}]),
  ],
  providers: [TransactionService]
})
export class TransactionModule {}

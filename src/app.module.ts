import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BillingModule } from './billing/billing.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'), 
    UserModule,
    BillingModule, 
    InvoiceModule, 
    TransactionModule
  ]
})
export class AppModule {}

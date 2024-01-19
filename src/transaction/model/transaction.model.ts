import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Account', required: true })
  accountId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['debit', 'credit'], required: true })
  type: string;

  @Prop({ enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
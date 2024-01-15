import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({type: SchemaTypes.ObjectId, required: true})
  userId: Types.ObjectId

  @Prop({required: true, default: Currency.RUR})
  currency: Currency

  @Prop({type: Number, default: 0})
  balance: number

  @Prop({type: String})
  cardId?: string;

  @Prop({type: SchemaTypes.Mixed})
  companyDetails?: string // Для реквизитов компании
}

export const AccountSchema = SchemaFactory.createForClass(Account);
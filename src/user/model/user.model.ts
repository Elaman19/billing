import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, type: String})
  username: string

  @Prop({required: true, trim: true})
  @IsEmail()
  email: string

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ type: Array<Types.ObjectId>})
  accounts: Array<Types.ObjectId>;
}

export const UserSchema = SchemaFactory.createForClass(User);
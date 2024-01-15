import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

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

  @Prop()
  cardId?: string;

  @Prop()
  rekv1: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
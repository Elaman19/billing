import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required: true, type: String})
  name: string

  @Prop({required: true, trim: true, type: String})
  @IsEmail()
  email: string

  @Prop({ required: true, trim: true, type: String })
  password: string

  @Prop({ type: String })
  hashdRt: string
}

export const UserSchema = SchemaFactory.createForClass(User);
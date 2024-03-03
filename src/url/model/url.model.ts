import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UrlDocument = HydratedDocument<Url>;

@Schema()
export class Url {
  @Prop({required: true, trim: true, type: String})
  @IsNotEmpty()
  url: string

  @Prop({required: true, trim: true, type: String})
  @IsNotEmpty()
  code: string
}

export const UrlSchema = SchemaFactory.createForClass(Url);
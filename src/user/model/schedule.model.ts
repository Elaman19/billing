import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TimeInterval } from 'src/constants';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema()
export class Schedule {
  @Prop({ type: Types.ObjectId })
  userId: String

  @Prop({ type: String })
  date: String

  @Prop({ type: Array<TimeInterval>})
  bookedSlots: Array<TimeInterval>
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
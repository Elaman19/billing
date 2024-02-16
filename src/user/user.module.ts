import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import { UserController } from './user.controller';
import { Schedule, ScheduleSchema } from './model/schedule.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
                                       { name: Schedule.name, schema: ScheduleSchema }])],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
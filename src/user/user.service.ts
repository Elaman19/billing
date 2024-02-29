import { BadRequestException, ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { TimeInterval } from 'src/constants';
import { BookSlotDto } from './dto/book-slot.dto';
import { pbkdf2Sync } from 'node:crypto'
import { Schedule, ScheduleDocument } from './model/schedule.model';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userModel.findOne({email: dto.email})
    if (user)
      throw new BadRequestException(`User email ${dto.email} is already exists`)
    
    const passHash = pbkdf2Sync(dto.password, 'salto', 1000, 25, `sha512`).toString(`hex`)
    const newUser = new this.userModel({...dto, password: passHash});
    return await newUser.save()
  }
}
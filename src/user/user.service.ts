import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private accountService: AccountService
  ) {}

  async createUser(dto: CreateUserDto) {
    const newUser = new this.userModel(dto);
    await newUser.save()
    // После регистрации пользователя создавается рублевый счет
    this.accountService.createAccount(newUser._id.toString())
    return HttpStatus.CREATED
  }
}
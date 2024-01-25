import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './model/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { AccountService } from 'src/account/account.service';
import { CreateAccountDto } from 'src/account/dto/create-account.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private accountService: AccountService
  ) {}

  async createUser(dto: CreateUserDto) {
    const newUser = new this.userModel(dto);
    // После регистрации пользователя создавается рублевый счет
    const createAccountDto: CreateAccountDto = { userId: newUser?._id?.toString()}
    const account = await this.accountService.create(createAccountDto)
    newUser.accounts = [account._id]
    return await newUser.save()
  }
}
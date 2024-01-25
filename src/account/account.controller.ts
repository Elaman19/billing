import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateAccountDto } from './dto/update-account.dto';
import { RepleinishAccountDto } from './dto/repleinish-account.dto';
import { WithdrawAccountDto } from './dto/withdraw-account.dto';
import { Types } from 'mongoose';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('getAll')
  async getAll(){
    return await this.accountService.getAll()
  }
  
  @Post('create')
  @ApiBody({ type: CreateAccountDto })
  async createAccount(@Body() dto: CreateAccountDto){
    return await this.accountService.create(dto)
  }

  @Patch('update')
  @ApiBody({ type: UpdateAccountDto })
  async updateAccount(@Body() dto: UpdateAccountDto){
    return await this.accountService.update(dto)
  }

  @Get('validate/:accountId')
  @ApiParam({ name: 'accountId', type: String})
  async validate(@Param('accountId') accountId: Types.ObjectId){
    return await this.accountService.validate(accountId)
  }

  @Post('repleinish')
  async repleinish(@Body() dto: RepleinishAccountDto){
    return await this.accountService.repleinish(dto)
  }

  @Post('withdraw')
  async withdraw(@Body() dto: WithdrawAccountDto){
    return await this.accountService.withdraw(dto)
  }

  @Get('balance/:accountId')
  @ApiParam({ name: 'accountId', type: String})
  async getBalance(@Param('accountId') accountId: Types.ObjectId){
    return await this.accountService.getBalance(accountId)
  }
}
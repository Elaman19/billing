import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BookSlotDto } from './dto/book-slot.dto';
import { Types } from 'mongoose';
import { GetSlotsDto } from './dto/get-slots-dto';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto){
    return await this.userService.createUser(dto)
  }

  @Patch('book-slot')
  @ApiBody({ type: BookSlotDto })
  async bookSlot(@Body() dto: BookSlotDto){
    return await this.userService.bookSlot(dto)
  }

  @Get('get-available-slots')
  async getAvailableSlots(@Query() dto: GetSlotsDto){
    return await this.userService.getAvailableTimeIntervals(dto.userId, dto.date)
  }
}
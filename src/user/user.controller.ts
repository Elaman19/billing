import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  async register(@Body() dto: CreateUserDto){
    return this.userService.createUser(dto)
  }
}
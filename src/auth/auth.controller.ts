import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @ApiBody({type: LoginDto})
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post('/register')
  @ApiBody({type: RegisterDto})
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }
}

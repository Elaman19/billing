import { Body, Controller, Post } from '@nestjs/common';
import { LogInDto } from './dto/login.dto';
import { RegisterDto } from "./dto/register.dto";
import { AuthService } from "./auth.service";
import { ApiTags, ApiBody} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  async registration(@Body() userDto: RegisterDto) {
    const { password, ...registerData } = userDto
    const token = await this.authService.registration(userDto)
    return token
  }
  
  @Post('/login')
  @ApiBody({ type: LogInDto })
  async login(@Body() userDto: LogInDto) {
    const token = await this.authService.login(userDto)
    return token
  }
}

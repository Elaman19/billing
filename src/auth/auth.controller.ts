import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Tokens } from './../types';
import { RefreshTokenGuard } from './guards';
import {
  GetCurrentUserId,
  GetCurrentUser,
  Public,
} from '../common/decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/login')
  @ApiBody({type: LoginDto})
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.login(dto);
    res.cookie('access_cookies', token.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    res.send({
      success: true,
    });
  }

  @Public()
  @Post('/register')
  @ApiBody({type: RegisterDto})
  async register(@Body() dto: RegisterDto): Promise<Tokens> {
    return await this.authService.register(dto);
  }

  @Post('/logout')
  async logout(@GetCurrentUserId() userId: string) {
    return await this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ) {
    return await this.authService.refreshTokens(userId, refreshToken);
  }
}

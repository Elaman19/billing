import { ForbiddenException, Injectable, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/model/user.model';
import { Tokens } from 'src/types';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, 
              private jwtService: JwtService){}
  
  @Post('register')
  async register(dto: RegisterDto): Promise<Tokens> {
    dto.password = await this.hashPassword(dto.password)
    const user: any = await this.userService.create(dto);
    const tokens = await this.getTokens(user);
    const refreshTokenHash = await this.hashPassword(tokens.refreshToken);
    await this.userService.updateOne(user._id, { hashdRt: refreshTokenHash });
    return tokens;
  }

  @Post('login')
  async login(dto: LoginDto): Promise<Tokens> {
    const user: any = await this.userService.findUserByEmail(dto.email);
    if (!user) 
      throw new ForbiddenException('Access Denied.');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) 
      throw new ForbiddenException('Access Denied.');
    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refreshToken);
    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    return tokens;
  }

  @Post('logout')
  async logout(userId: string) {
    await this.userService.updateOne(userId, { hashdRt: null });
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');
    const rtMatches = await bcrypt.compare(rt, user.hashdRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied.');
    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refreshToken);
    await this.userService.updateOne(user._id.toString(), { hashdRt: rtHash });
    return tokens;
  }

  private async getTokens(user: UserDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
        },
      ),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  private async hashPassword(data: string): Promise<string>{
    return await bcrypt.hash(data, 10)
  }
}
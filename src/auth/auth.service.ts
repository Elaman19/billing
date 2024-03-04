import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, 
              private jwtService: JwtService){}
  
  async register(dto: RegisterDto): Promise<String> {
    const exists = await this.userService.findUserByEmail(dto.email)
    if (exists) 
      throw new ConflictException('User already exists')

    dto.password = await this.hashPassword(dto.password)
    const user = await this.userService.create(dto)
    const token = await this.getToken(user)
    return token
  }

  async login(dto: LoginDto): Promise<String> {
    const user = await this.getUser(dto)
    const token = await this.getToken(user)
    return token
  }

  private async getUser(dto: LoginDto): Promise<User>{
    const user = await this.userService.findUserByEmail(dto.email)
    if (!user) 
      throw new UnauthorizedException('Incorrect login or password')

    const arePasswordsEqual = await bcrypt.compare(dto.password, user.password)
    if (!arePasswordsEqual) 
      throw new UnauthorizedException('Incorrect login or password')
    
    return user
  }

  private async getToken(user: User): Promise<String> {
    return await this.jwtService.signAsync({
        sub: user.name,
        email: user.email,
      },
      {
        secret: process.env.JWT_TOKEN_SECRET,
        expiresIn: process.env.JWT_TOKEN_TTL,
      },
    )
  }

  private async hashPassword(data: string): Promise<string>{
    return await bcrypt.hash(data, 10)
  }
}
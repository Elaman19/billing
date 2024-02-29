import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { LogInDto } from './dto/login.dto';
import RegisterDto from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/model/user.model';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, 
              private jwtService: JwtService){}

  async registration(userDto: RegisterDto){
    const candidate = await this.userService.getUserByEmail(userDto.email)
    if (candidate){ // && candidate
      throw new BadRequestException(`User with email ${userDto.email} already exists`)
    } 

    this.checkPassword(userDto.password)
    const hashPassword = await this.hash(userDto.password)
    const user = await this.userService.createUser({...userDto, password: hashPassword})
    return this.generateToken(user)
  }

  async login(userDto: LogInDto){
    const user = await this.validateUser(userDto)
    return this.generateToken(user)
  }

  private async validateUser(userDto: LogInDto): Promise<User>{
    const user = await this.userService.getUserByEmail(userDto.email)
    if (!user) throw new BadRequestException({message: 'User not found'})
    const arePasswordsEqual = await bcrypt.compare(userDto.password, user.password)
    if (!arePasswordsEqual) throw new UnauthorizedException({message: 'Incorrect email or password'})
    return user
  }

  private generateToken(user: User): {token: string}{
    const name = `${user.firstName} ${user.lastName}`
    const payload = { email: user.email, role: user.role, name, firstName: user.firstName, lastName: user.lastName, stripeCustomerId: user.stripeCustomerId ?? '', stripeAccountId: user.stripeAccountId ?? '' }
    const options: JwtSignOptions = { secret: process.env.JWT_TOKEN_SECRET, expiresIn: process.env.JWT_TOKEN_TTL }
    const token = this.jwtService.sign(payload, options)
    return { token }
  }

  private checkPassword(password: string){
    if (!/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(password))
      throw new UnprocessableEntityException(`Password must contain at least 1 upper case letter, 1 lower case letter and 1 number or special character`)
  }

  private async hash(password: string){
    return await bcrypt.hash(password, 5)
  }
}
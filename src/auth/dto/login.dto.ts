import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({type: String, example: 'test@gmail.com'})
  @IsEmail()
  email: string

  @ApiProperty({type: String, example: '1234qwer'})
  @IsNotEmpty()
  password: string
}
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({type: String, example: 'test@gmail.com'})
  @IsEmail()
  email: string

  @ApiProperty({type: String, example: '1234qwer'})
  @IsNotEmpty()
  password: string

  @ApiProperty({type: String, example: 'John Doe'})
  @IsString()
  name: string
}
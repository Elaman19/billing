import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator"
import { TimeInterval, UserType } from "src/constants"

export class CreateUserDto {
  @ApiProperty({description: 'name', example: 'John Doe'})
  @IsString()
  name: string

  @ApiProperty({description: 'email', example: 'test@gmail.com'})
  @IsEmail()
  email: string

  @ApiProperty({description: 'password', example: 'QWErty12345'})
  @IsString()
  password: string

  @ApiProperty({description: 'type', example: 'BARBER', enum: UserType})
  @IsEnum(UserType)
  @IsNotEmpty()
  type: UserType

  @ApiProperty({description: 'workTime', type: TimeInterval})
  workTime: TimeInterval

  @ApiProperty({description: 'lunchTime', type: TimeInterval})
  lunchTime: TimeInterval
}
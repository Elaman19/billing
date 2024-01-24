import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
  @ApiProperty({description: 'username', example: 'John Doe'})
  username: string
  @ApiProperty({description: 'email', example: 'test@gmail.com'})
  email: string
  @ApiProperty({description: 'password', example: 'QWErty12345'})
  password: string
}
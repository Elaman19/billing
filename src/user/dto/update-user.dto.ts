import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;
}
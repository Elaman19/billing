import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  name: string;

  hashdRt: string;
}
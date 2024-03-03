import { ApiProperty } from "@nestjs/swagger"
import { IsUrl } from "class-validator"

export class CreateUrlDto {
  @ApiProperty({type: String, example: 'https://www.google.com/search?q=Lorem+ipsum+dolor+sit+amet%2C+consectetur+adipiscing+elit%2C+sed+do+eiusmod+tempor+incididunt+ut+labore+et+dolore+magna+aliqua'})
  @IsUrl()
  url: string

  code?: string
}
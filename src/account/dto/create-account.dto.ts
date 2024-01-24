import { ApiProperty } from "@nestjs/swagger"
import { Currency } from "src/constants"

export class CreateAccountDto {
  @ApiProperty({description: 'userId', example: '65b0b8e39d33054bbd76edf8'})
  userId: string
  @ApiProperty({description: 'currency', example: 'USD'})
  currency?: Currency
}
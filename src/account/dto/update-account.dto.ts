import { ApiProperty } from "@nestjs/swagger"
import { Currency } from "src/constants"

export class UpdateAccountDto {
  @ApiProperty({description: 'accountId', example: '65b0b8e39d33054bbd76edf8'})
  accountId: string
  @ApiProperty({description: 'cardId', example: '65b0b8e39d33054bbd76edf8'})
  cardId?: string
  @ApiProperty({description: 'companyDetails', example: '65b0b8e39d33054bbd76edf8'})
  companyDetails?: string // Для реквизитов компании
}
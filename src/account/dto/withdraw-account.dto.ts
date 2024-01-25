import { ApiProperty } from "@nestjs/swagger"
import { Types } from "mongoose"

export class WithdrawAccountDto {
  @ApiProperty({description: 'accountId', example: '65b0b8e39d33054bbd76edf8'})
  accountId: Types.ObjectId
  @ApiProperty({description: 'amount', example: 100})
  amount: number
}
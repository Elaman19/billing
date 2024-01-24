import { ApiProperty } from "@nestjs/swagger"

export class WithdrawAccountDto {
  @ApiProperty({description: 'accountId', example: '65b0b8e39d33054bbd76edf8'})
  accountId: string
  @ApiProperty({description: 'amount', example: 100})
  amount: number
}
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { TimeInterval } from "src/constants"

export class GetSlotsDto {
  @ApiProperty({description: 'userId', example: '65a0aff937e4beb824bc3689'})
  @IsString()
  userId: string

  @ApiProperty({description: 'date', example: '2024-02-15'})
  @IsString()
  date: string
}
import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"
import { TimeInterval } from "src/constants"

export class BookSlotDto {
  @ApiProperty({description: 'userId', example: '65a0aff937e4beb824bc3689'})
  @IsString()
  userId: string

  @ApiProperty({description: 'time interval'})
  slot: TimeInterval
}
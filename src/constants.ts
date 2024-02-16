import { Prop } from "@nestjs/mongoose"
import { ApiProperty } from "@nestjs/swagger"
import { IsDate } from "class-validator"

export enum UserType {
  BARBER = 'BARBER',
  DENTIST = 'DENTIST',
  PSYCHOLOGIST = 'PSYCHOLOGIST'
}

export class TimeInterval {
  @ApiProperty({description: 'start', example: '2024-02-16T10:00:00', type: Date})
  @IsDate()
  @Prop({type: Date})
  start: Date

  @ApiProperty({description: 'end', example: '2024-02-16T18:00:00', type: Date})
  @IsDate()
  @Prop({type: Date})
  end: Date
}
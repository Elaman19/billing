import { Currency } from "src/constants"

export class CreateAccountDto {
  userId: string
  currency?: Currency
}
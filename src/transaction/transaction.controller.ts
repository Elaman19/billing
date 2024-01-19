import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post(':accountId')
  async processTransaction(
    @Param('accountId', new ParseUUIDPipe()) accountId: string,
    @Body('amount') amount: number,
    @Body('type') type: string,
  ) {
    const transaction = await this.transactionService.processTransaction(accountId, amount, type);
    return { message: 'Transaction processed successfully', transaction };
  }
}
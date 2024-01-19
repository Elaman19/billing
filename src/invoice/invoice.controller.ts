import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post(':accountId')
  async createInvoice(
    @Param('accountId', new ParseUUIDPipe()) accountId: string,
    @Body('amount') amount: number,
  ) {
    const invoice = await this.invoiceService.createInvoice(accountId, amount);
    return { message: 'Invoice created successfully', invoice };
  }
}
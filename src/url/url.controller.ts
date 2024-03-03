import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

@Controller()
@ApiTags('Url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiBody({type: CreateUrlDto})
  async shorten(@Body() dto: CreateUrlDto): Promise<string> {
    const url = await this.urlService.findByLongUrl(dto.url)
    if (url?.code) 
      return url.code

    return await this.urlService.shorten(dto)
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response){
    const url = await this.urlService.getLongUrl(code)
    return res.redirect(url)
  }
}
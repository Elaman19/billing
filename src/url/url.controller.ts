import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller()
@ApiTags('Url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "shorten url"})
  @ApiBody({type: CreateUrlDto})
  async shorten(@Body() dto: CreateUrlDto): Promise<string> {
    return await this.urlService.shorten(dto)
  }

  @Get(':code')
  @ApiOperation({summary: "redirect short url to long url"})
  async redirect(@Param('code') code: string, @Res() res: Response){
    const url = await this.urlService.findByCode(code)
    return res.redirect(url)
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: "get all urls"})
  async getAll(){
    return await this.urlService.getAllUrls()
  }
}
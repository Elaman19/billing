import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './model/url.model';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
    JwtModule
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}

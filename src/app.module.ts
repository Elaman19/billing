import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost/inno'), 
    UserModule, 
    UrlModule,
    AuthModule
  ]
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategy';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  imports: [
    PassportModule,
    JwtModule.register({}),
    UserModule
  ],
  controllers: [AuthController]
})
export class AuthModule {}
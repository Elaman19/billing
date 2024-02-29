import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Logger],
  imports: [
      JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          return {
            secret: config.get<string>('JWT_TOKEN_SECRET'),
            signOptions: {
              expiresIn: '24h'
            }
          }
        }
      }),
      UserModule
  ],
  exports: [
      AuthService,
      JwtModule
  ]
})
export class AuthModule {}
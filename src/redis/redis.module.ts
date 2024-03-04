import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from './redis.service';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore.redisStore as any,
      url: process.env.REDIS_STORE
    })
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(key: string, value: string): Promise<void> {
    try {
      await this.cacheManager.set(key, value)
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async get(key: string): Promise<string | undefined> {
    try {
      return await this.cacheManager.get(key)
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
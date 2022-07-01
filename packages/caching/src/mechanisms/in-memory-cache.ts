import { Injectable } from '@nestjs/common';
import * as NodeCache from 'node-cache';
import { ICacheClient } from '../abstractions';

interface IInMemoryCacheOptions {
  ttl?: number;
  checkPeriod?: number;
  deleteOnExpire?: boolean;
  maxKeys?: number;
}

@Injectable()
export class InMemoryCache implements ICacheClient {
  private cache: NodeCache;

  constructor(options?: IInMemoryCacheOptions) {
    this.cache = new NodeCache({
      stdTTL: options?.ttl ?? 0,
      checkperiod: options?.checkPeriod ?? 0,
      deleteOnExpire: options?.deleteOnExpire ?? true,
      maxKeys: options?.maxKeys ?? -1,
    });
  }

  public async set<T>(key: string, value: T, ttl: number = 10000) {
    this.cache.set(key, value, ttl);
  }

  public async get<T>(key: string): Promise<T> {
    return this.cache.get<T>(key);
  }

  public async delete(key: string) {
    this.cache.del(key);
  }

  public async flushAll(): Promise<void> {
    this.cache.flushAll();
  }
}

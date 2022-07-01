import { ClassType } from '@ota-internal/shared';

export interface ICacheClient {
  set<T>(key: string, value: T, ttl: number): Promise<void>;
  get<T>(key: string): Promise<T>;
  delete(key: string): Promise<void>;
  flushAll(): Promise<void>;
}

export const ICacheClient = new (class Dummy {})() as ClassType<ICacheClient>;

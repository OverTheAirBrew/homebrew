import { Injectable } from '@nestjs/common';
import { ICacheClient } from '@ota-internal/caching';
import { ClassType } from '@ota-internal/shared';
import { operation } from 'retry';
import { v4 as uuid } from 'uuid';

interface ILockResponse {
  unlock(): Promise<void>;
}

export interface ILockingClient {
  lock(key: string, ttl: number): Promise<ILockResponse>;
}
export const ILockingClient = class Dummy {} as ClassType<ILockingClient>;

@Injectable()
export class LockingClient {
  constructor(private cacheClient: ICacheClient) {}

  public async lock(
    key: string,
    ttl: number,
    retryCount: number = 0,
  ): Promise<ILockResponse> {
    const retryOperation = operation({
      retries: retryCount,
    });

    return await new Promise<ILockResponse>((resolve, reject) =>
      retryOperation.attempt(async () => {
        try {
          const lockKey = await this.makeKey(key);

          const existingKey = await this.cacheClient.get(lockKey);

          if (existingKey) {
            throw new Error('key already locked');
          }

          await this.cacheClient.set(lockKey, uuid(), ttl);

          resolve({ unlock: this.unlock.bind(this, key) });
        } catch (err) {
          if (retryOperation.retry(err)) {
            return;
          }

          reject(err);
        }
      }),
    );
  }

  private async unlock(key: string) {
    await this.cacheClient.delete(key);
  }

  private async makeKey(key: string) {
    return `${key}:lock`;
  }
}

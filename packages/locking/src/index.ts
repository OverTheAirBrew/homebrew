import { Global, Module } from '@nestjs/common';
import { CachingModule } from '@ota-internal/caching';
import { ILockingClient, LockingClient } from './locking';

@Global()
@Module({
  imports: [CachingModule],
  providers: [
    LockingClient,
    {
      provide: ILockingClient,
      useClass: LockingClient,
    },
  ],
  exports: [ILockingClient],
})
export class LockingModule {}

export { ILockingClient };

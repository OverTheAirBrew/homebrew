import { Global, Module } from '@nestjs/common';
import { ICacheClient } from './abstractions';
import { InMemoryCache } from './mechanisms/in-memory-cache';

@Global()
@Module({
  providers: [
    {
      provide: ICacheClient,
      useValue: new InMemoryCache(),
    },
  ],
  exports: [ICacheClient],
})
export class CachingModule {}

export { ICacheClient };

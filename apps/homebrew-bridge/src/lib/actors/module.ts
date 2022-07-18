import { Module } from '@nestjs/common';
import { IActor } from '@ota-internal/shared';
import { IActors } from '../constants';
import { GpioActor } from './gpio';
import { ActorService } from './service';

const Actors = [GpioActor];

@Module({
  providers: [
    ...Actors,
    {
      provide: IActors,
      useFactory: (...actors: IActor<any>[]) => {
        return actors;
      },
      inject: [...Actors],
    },
    ActorService,
  ],
  exports: [ActorService],
})
export class ActorModule {}

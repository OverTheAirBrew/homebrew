import { Inject, Injectable } from '@nestjs/common';
import { IActor } from '@ota-internal/shared';
import { IActors } from '../constants';

@Injectable()
export class ActorService {
  constructor(@Inject(IActors) private actors: IActor<any>[]) {}

  public async enableActor<T>(actorType: string, params: T) {
    const actor = this.actors.find((a) => a.name === actorType);

    if (!actor) {
      throw new Error(`Actor ${actorType} not found`);
    }

    return await actor.on(undefined, params);
  }

  public async disableActor<T>(actorType: string, params: T) {
    const actor = this.actors.find((a) => a.name === actorType);

    if (!actor) {
      throw new Error(`Actor ${actorType} not found`);
    }

    return await actor.on(undefined, params);
  }
}

import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClassType } from '../class-type';
import { ActorStateChanged } from '../messages/actor-state-changed';
import { IPeripheral, Peripheral } from '../properties';
import { Property } from '../properties/base-property';

export interface IActor<T> extends IPeripheral {
  on(actor_id: string, params: T): Promise<void>;
  off(actor_id: string, params: T): Promise<void>;
}

export const IActor = class Dummy {} as ClassType<IActor<any>>;

export abstract class Actor<T> extends Peripheral implements IActor<T> {
  constructor(
    actorName: string,
    public properties: Property[],
    private eventEmitter: EventEmitter2,
  ) {
    super(`${actorName}-actor`, properties);
  }

  public async on(actor_id: string, params: T) {
    await this.processOn(params);

    this.eventEmitter.emit(
      ActorStateChanged.Channel,
      new ActorStateChanged(actor_id, 'on'),
    );
  }

  public async off(actor_id: string, params: T) {
    await this.processOff(params);

    this.eventEmitter.emit(
      ActorStateChanged.Channel,
      new ActorStateChanged(actor_id, 'off'),
    );
  }

  protected abstract processOn(params: T): Promise<void>;
  protected abstract processOff(params: T): Promise<void>;
}

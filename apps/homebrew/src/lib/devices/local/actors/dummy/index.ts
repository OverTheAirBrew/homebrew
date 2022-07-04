import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Actor, IActor } from '@ota-internal/shared';

interface IDummyActorProps {}

@Injectable()
export class DummyActor
  extends Actor<IDummyActorProps>
  implements IActor<IDummyActorProps>
{
  constructor(eventEmitter: EventEmitter2) {
    super('dummy', [], eventEmitter);
  }

  protected async processOn(params: IDummyActorProps) {}

  protected async processOff(params: IDummyActorProps) {}
}

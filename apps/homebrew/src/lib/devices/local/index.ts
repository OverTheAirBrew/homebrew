import { Inject, Injectable } from '@nestjs/common';
import { Actor, Sensor } from '@ota-internal/shared';
import { IActors, ISensors } from '../../constants';
import { PropertyMapper } from '../../property-mapper';
import { Device } from '../base-device';

@Injectable()
export class LocalDevice extends Device<{}> {
  constructor(
    @Inject(IActors) actors: Actor<any>[],
    @Inject(ISensors) sensors: Sensor<any>[],
    propertyMapper: PropertyMapper,
  ) {
    super('local', [], actors, sensors);
  }
}

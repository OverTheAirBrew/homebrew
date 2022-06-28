import { Inject } from '@nestjs/common';
import { IActors, ISensors } from '../../../src/lib/constants';
import { Device } from '../../../src/lib/devices/base-device';
import { IActor } from '../../../src/lib/plugin/abstractions/actor';
import { ISensor } from '../../../src/lib/plugin/abstractions/sensor';
import { StringProperty } from '../../../src/lib/plugin/properties';
import { PropertyMapper } from '../../../src/lib/property-mapper';

export class TestingDevice extends Device<any> {
  constructor(
    @Inject(IActors) actors: IActor<any>[],
    @Inject(ISensors) sensors: ISensor<any>[],
    propertyMapper: PropertyMapper,
  ) {
    super(
      'testing',
      [new StringProperty('testing', true)],
      actors,
      sensors,
      propertyMapper,
    );
  }
}

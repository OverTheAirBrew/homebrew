import { Inject } from '@nestjs/common';
import { IActors, ISensors } from '../../../src/lib/constants';
import { Device } from '../../../src/lib/devices/base-device';
import { IActor } from '../../../src/lib/plugin/abstractions/actor';
import { ISensor } from '../../../src/lib/plugin/abstractions/sensor';
import { StringProperty } from '../../../src/lib/plugin/properties';

export class TestingDevice extends Device<any> {
  constructor(
    @Inject(IActors) actors: IActor<any>[],
    @Inject(ISensors) sensors: ISensor<any>[],
  ) {
    super('testing', [new StringProperty('testing', true)], actors, sensors);
  }
}

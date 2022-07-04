import { Inject } from '@nestjs/common';
import { IActor, ISensor, StringProperty } from '@ota-internal/shared';
import { IActors, ISensors } from '../../../src/lib/constants';
import { Device } from '../../../src/lib/devices/base-device';

export class TestingDevice extends Device<any> {
  constructor(
    @Inject(IActors) actors: IActor<any>[],
    @Inject(ISensors) sensors: ISensor<any>[],
  ) {
    super('testing', [new StringProperty('testing', true)], actors, sensors);
  }
}

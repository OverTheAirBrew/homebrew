import { TestingActor } from '../../../test/utils/test-providers/actor';
import { TestingSensor } from '../../../test/utils/test-providers/sensor';
import { NumberProperty, StringProperty } from '../plugin/properties';
import { Device } from './base-device';

class BaseDevice extends Device<{}> {
  constructor() {
    super(
      'test',
      [new StringProperty('string', true)],
      [
        {
          properties: [new NumberProperty('number', true)],
          name: 'test-actor',
          validate: jest.fn().mockReturnValue(true),
        } as any as TestingActor,
      ],
      [
        {
          properties: [new NumberProperty('number', true)],
          name: 'test-sensor',
          validate: jest.fn().mockReturnValue(true),
        } as any as TestingSensor,
      ],
    );
  }
}

describe('devices/base-device', () => {
  beforeEach(() => {});

  it('test', () => {});
});

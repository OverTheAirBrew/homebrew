import { NumberProperty, StringProperty } from '@ota-internal/shared';
import { TestingActor } from '../../../test/utils/test-providers/actor';
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
        } as any,
      ],
    );
  }
}

describe('devices/base-device', () => {
  beforeEach(() => {});

  it('test', () => {});
});

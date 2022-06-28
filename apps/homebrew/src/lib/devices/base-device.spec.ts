import { TestingActor } from '../../../test/utils/test-providers/actor';
import { TestingSensor } from '../../../test/utils/test-providers/sensor';
import { Sensor } from '../plugin/abstractions/sensor';
import { NumberProperty, StringProperty } from '../plugin/properties';
import { PropertyMapper } from '../property-mapper';
import { Device } from './base-device';

class BaseDevice extends Device<{}> {
  constructor(propertyMapper: PropertyMapper) {
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
      propertyMapper,
    );
  }
}

describe('devices/base-device', () => {
  let service: BaseDevice;

  let propertyMapperStub: jest.Mock;

  beforeEach(() => {
    propertyMapperStub = jest.fn().mockResolvedValue('');

    service = new BaseDevice({
      map: propertyMapperStub,
    });
  });

  describe('getActorTypes', () => {
    it('should return a list of mapped actor types', async () => {
      const result = await service.getActorTypes();
      expect(result).toMatchObject([
        {
          type: 'test-actor',
          properties: [''],
        },
      ]);

      expect(propertyMapperStub.mock.calls).toHaveLength(1);
    });
  });

  describe('getRawSensorTypes', () => {
    it('should return raw sensor types', async () => {
      const sensorTypes = await service.getRawActorTypes();

      console.log(sensorTypes);
      expect(sensorTypes).toHaveLength(1);
      expect(sensorTypes[0]).toBeInstanceOf(Sensor);
    });
  });
});

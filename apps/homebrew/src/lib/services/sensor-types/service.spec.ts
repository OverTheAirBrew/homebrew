import { Test } from '@nestjs/testing';
import { InvalidSensorTypeError } from '../../../lib/errors/invalid-sensor-type';
import { Sensor } from '../../../lib/plugin/abstractions/sensor';
import { NumberProperty } from '../../../lib/plugin/properties';
import { PropertyMapper } from '../../../lib/property-mapper';
import { DeviceTypesService } from '../device-types/service';
import { SensorTypesService } from './service';

class TestingSensorType extends Sensor<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)]);
  }

  public async process() {
    return 1;
  }
}

describe('sensor-types-service', () => {
  let service: SensorTypesService;
  let mapperSpy: PropertyMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SensorTypesService,
        TestingSensorType,
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn(),
          }),
        },
        {
          provide: DeviceTypesService,
          useFactory: () => ({
            getRawDeviceTypeById: jest.fn().mockResolvedValue({
              sensors: [new TestingSensorType()],
            }),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(SensorTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getSensorTypes', () => {
    it('should map all the properties', async () => {
      await service.getSensorTypes('testing-device');
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawSensorTypeById', () => {
    it('should return the raw logic type', async () => {
      const logicType = await service.getRawSensorTypeById(
        'testing-device',
        'testing-sensor',
      );
      expect(logicType).toBeInstanceOf(TestingSensorType);
    });

    it('should throw an error if the sensor type does not exist', async () => {
      try {
        await service.getRawSensorTypeById('testing-device', 'invalid-sensor');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidSensorTypeError);
      }
    });
  });

  // describe('getSensorTypeById', () => {
  //   it('should return a mapped logic type', async () => {
  //     const logicType = await service.getSensorTypeById(
  //       'testing-device',
  //       'testing-sensor',
  //     );
  //     expect(logicType).toBeInstanceOf(SensorTypeDto);
  //   });
  // });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await service.validateConfig(
        'testing-device',
        'testing-sensor',
        {
          number: 1,
        },
      );

      expect(valid).toBeTruthy();
    });

    it('should return false when the config is invalid', async () => {
      const valid = await service.validateConfig(
        'testing-device',
        'testing-sensor',
        {
          number: undefined,
        },
      );

      expect(valid).toBeFalsy();
    });
  });
});

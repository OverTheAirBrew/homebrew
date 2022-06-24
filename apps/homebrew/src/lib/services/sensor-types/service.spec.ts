import { Test } from '@nestjs/testing';
import { ISensors } from '../../../lib/constants';
import { InvalidSensorTypeError } from '../../../lib/errors/invalid-sensor-type';
import { Sensor } from '../../../lib/plugin/abstractions/sensor';
import { NumberProperty } from '../../../lib/plugin/properties';
import { PropertyMapper } from '../../../lib/property-mapper';
import { SensorTypeDto } from '../../../models/dto/sensor-type.dto';
import { SensorTypesService } from './service';

class TestingSensorType extends Sensor<any> {
  constructor() {
    super('testing', [new NumberProperty('number', true)], {
      en: {},
    });
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
          provide: ISensors,
          useFactory: (...sensors: any) => {
            return sensors;
          },
          inject: [TestingSensorType],
        },
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(SensorTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getLogicTypes', () => {
    it('should map all the properties', async () => {
      await service.getSensorTypes();
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawLogicTypeById', () => {
    it('should return the raw logic type', async () => {
      const logicType = await service.getRawSensorTypeById('testing-sensor');
      expect(logicType).toBeInstanceOf(TestingSensorType);
    });

    it('should throw an error if the logic type does not exist', async () => {
      try {
        await service.getRawSensorTypeById('invalid-sensor');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidSensorTypeError);
      }
    });
  });

  describe('getLogicTypeById', () => {
    it('should return a mapped logic type', async () => {
      const logicType = await service.getSensorTypeById('testing-sensor');
      expect(logicType).toBeInstanceOf(SensorTypeDto);
    });
  });

  describe('validateConfig', () => {
    it('should return true when the config is valid', async () => {
      const valid = await service.validateConfig('testing-sensor', {
        number: 1,
      });

      expect(valid).toBeTruthy();
    });

    it('should return false when the config is invalid', async () => {
      const valid = await service.validateConfig('testing-sensor', {
        number: undefined,
      });

      expect(valid).toBeFalsy();
    });
  });
});

import { Test } from '@nestjs/testing';
import { DeviceService } from '../services/device/service';
import { SensorTypesService } from '../services/sensor-types/service';

import { ValidSensorType } from './valid-sensor-type';

describe('lib/validation/valid-sensor-type', () => {
  let service: ValidSensorType;

  let getRawSensorTypeByIdStub: jest.Mock;

  beforeEach(async () => {
    getRawSensorTypeByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidSensorType],
    })
      .useMocker((token) => {
        if (token === SensorTypesService) {
          return {
            getRawSensorTypeById: getRawSensorTypeByIdStub,
          };
        }

        if (token === DeviceService) {
          return {
            getDeviceById: jest.fn().mockReturnValue({ type_id: 1 }),
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidSensorType);
  });

  describe('validate', () => {
    it('should return true of the sensor type is valid', async () => {
      getRawSensorTypeByIdStub.mockReturnValue({});

      const valid = await service.validate('1', { object: {} } as any);
      expect(valid).toBeTruthy();
    });

    it('should return false if the sensor type is invalid', async () => {
      getRawSensorTypeByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const valid = await service.validate('1', { object: {} } as any);
      expect(valid).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should generate the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid sensor type');
    });
  });
});

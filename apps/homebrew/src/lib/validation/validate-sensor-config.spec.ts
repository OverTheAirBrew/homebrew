import { Test } from '@nestjs/testing';
import { DeviceService } from '../services/device/service';
import { SensorTypesService } from '../services/sensor-types/service';
import { ValidSensorConfig } from './validate-sensor-config';

describe('lib/validation/validate-sensor-config', () => {
  let service: ValidSensorConfig;

  let validateConfigStub: jest.Mock;

  beforeEach(async () => {
    validateConfigStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidSensorConfig],
    })
      .useMocker((token) => {
        if (token === SensorTypesService) {
          return {
            validateConfig: validateConfigStub,
          };
        }

        if (token === DeviceService) {
          return {
            getDeviceById: jest.fn().mockReturnValue({ type_id: 1 }),
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidSensorConfig);
  });

  describe('validate', () => {
    it('should return true if there is no sensor id in the request', async () => {
      const response = await service.validate('test', { object: {} } as any);
      expect(response).toBeTruthy();
    });

    it('should return true if the config is valid', async () => {
      validateConfigStub.mockReturnValue(true);

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeTruthy();
    });

    it('should return false if the config is invalid', async () => {
      validateConfigStub.mockReturnValue(false);

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });

    it('should return false if there is a problem during validation', async () => {
      validateConfigStub.mockImplementation(() => {
        throw new Error();
      });

      const response = await service.validate('test', {
        object: {
          type_id: 'testing',
        },
      } as any);

      expect(response).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should return the default message', async () => {
      const response = service.defaultMessage({} as any);
      expect(response).toBe('Config is not valid for the sensor type');
    });
  });
});

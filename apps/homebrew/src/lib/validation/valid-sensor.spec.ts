import { Test } from '@nestjs/testing';
import { SensorService } from '../services/sensor/service';
import { ValidSensor } from './valid-sensor';

describe('lib/validation/valid-sensor', () => {
  let service: ValidSensor;

  let getSensorByIdStub: jest.Mock;

  beforeEach(async () => {
    getSensorByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidSensor],
    })
      .useMocker((token) => {
        if (token === SensorService) {
          return {
            getSensorById: getSensorByIdStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidSensor);
  });

  describe('validate', () => {
    it('should return true of the sensor is valid', async () => {
      getSensorByIdStub.mockReturnValue({});

      const valid = await service.validate('1');
      expect(valid).toBeTruthy();
    });

    it('should return false if the sensor is invalid', async () => {
      getSensorByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const valid = await service.validate('1');
      expect(valid).toBeFalsy();
    });

    it('should return true if there is no value specified', async () => {
      const valid = await service.validate('');
      expect(valid).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('should generate the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid sensor');
    });
  });
});

import { Test } from '@nestjs/testing';
import { DeviceService } from '../services/device/service';
import { ValidDevice } from './valid-device';

describe('lib/validation/valid-device', () => {
  let service: ValidDevice;

  let getDeviceByIdStub: jest.Mock;

  beforeEach(async () => {
    getDeviceByIdStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [ValidDevice],
    })
      .useMocker((token) => {
        if (token === DeviceService) {
          return {
            getDeviceById: getDeviceByIdStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(ValidDevice);
  });

  describe('validate', () => {
    it('should return true if the device exists', async () => {
      getDeviceByIdStub.mockReturnValue({});

      const result = await service.validate('test');
      expect(result).toBeTruthy();
    });

    it('should return false if the device doesnt exists', async () => {
      getDeviceByIdStub.mockImplementation(() => {
        throw new Error('');
      });

      const result = await service.validate('test');
      expect(result).toBeFalsy();
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct message', () => {
      const message = service.defaultMessage({
        property: 'test-property',
      } as any);

      expect(message).toBe('test-property is not a valid device');
    });
  });
});

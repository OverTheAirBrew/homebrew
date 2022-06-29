import { Test } from '@nestjs/testing';
import { IDevices } from '../../constants';
import { PropertyMapper } from '../../property-mapper';
import { DeviceTypesService } from './service';

import { TestingDevice } from '../../../../test/utils/test-providers/device';
import { InvalidDeviceTypeError } from '../../errors/invalid-device-type';

describe('lib/services/device-types', () => {
  let service: DeviceTypesService;
  let mapperStub: jest.Mock;

  beforeEach(async () => {
    mapperStub = jest.fn().mockResolvedValue({});

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeviceTypesService,
        {
          provide: IDevices,
          useFactory: () => {
            return [new TestingDevice([], [])];
          },
        },
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: mapperStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(DeviceTypesService);
  });

  describe('getDeviceTypes', () => {
    it('should map the properties', async () => {
      await service.getDeviceTypes();
      expect(mapperStub).toHaveBeenCalled();
    });
  });

  describe('getRawDeviceTypeById', () => {
    it('should return the raw device type', async () => {
      const deviceType = await service.getRawDeviceTypeById('testing-device');
      expect(deviceType.name).toBe('testing-device');
    });

    it('should throw an error if the device type does not exist', async () => {
      try {
        await service.getRawDeviceTypeById('unknown-device');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDeviceTypeError);
      }
    });
  });
});

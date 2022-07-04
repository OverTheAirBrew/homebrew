import { Test } from '@nestjs/testing';
import { DeviceDto } from '../../../models/dto/device.dto';
import { DeviceRepository } from '../../constants';
import { DeviceDoesNotExistError } from '../../errors/device-does-not-exist-error';
import { DeviceService } from './service';

describe('device-service', () => {
  let service: DeviceService;

  let findByPkStub: jest.Mock;
  let findAllStub: jest.Mock;

  beforeEach(async () => {
    findByPkStub = jest.fn().mockReturnValue({
      id: 'device_id',
      name: 'device_name',
      type_id: 'device_type_id',
      config: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    findAllStub = jest.fn().mockReturnValue([
      {
        id: 'device_id',
        name: 'device_name',
        type_id: 'device_type_id',
        config: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: DeviceRepository,
          useFactory: () => ({
            findByPk: findByPkStub,
            findAll: findAllStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(DeviceService);
  });

  describe('getDeviceById', () => {
    it('should return a mapped device', async () => {
      const device = await service.getDeviceById('device_id');
      expect(device).toBeInstanceOf(DeviceDto);
      expect(device).toMatchObject({
        id: 'device_id',
        name: 'device_name',
        type_id: 'device_type_id',
        config: {},
      });
    });

    it('should throw an error if the device is not found', async () => {
      findByPkStub.mockReturnValue(null);

      try {
        await service.getDeviceById('device_id');
        fail('should throw an error');
      } catch (err) {
        expect(err).toBeInstanceOf(DeviceDoesNotExistError);
      }
    });
  });

  describe('getAllDevices', () => {
    it('should return a list of mapped devices', async () => {
      const devices = await service.getAllDevices();
      expect(devices).toBeInstanceOf(Array<DeviceDto>);
    });
  });
});

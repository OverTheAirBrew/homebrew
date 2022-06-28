import { Test } from '@nestjs/testing';
import { TestingActor } from '../../../../test/utils/test-providers/actor';
import { TestingDevice } from '../../../../test/utils/test-providers/device';
import { TestingSensor } from '../../../../test/utils/test-providers/sensor';
import { IActors, IDevices, ISensors } from '../../constants';
import { InvalidDeviceTypeError } from '../../errors/invalid-device-type';
import { PropertyMapper } from '../../property-mapper';
import { DeviceTypesService } from './service';

describe('lib/services/device-types', () => {
  let service: DeviceTypesService;
  let mapperSpy: PropertyMapper;

  let sensorValidateStub: jest.Mock;
  let actorValidateStub: jest.Mock;

  beforeEach(async () => {
    sensorValidateStub = jest.fn().mockResolvedValue(true);
    actorValidateStub = jest.fn().mockResolvedValue(true);

    const moduleRef = await Test.createTestingModule({
      providers: [
        DeviceTypesService,
        TestingDevice,
        {
          provide: IDevices,
          useFactory: (...devices: any) => {
            return devices;
          },
          inject: [TestingDevice],
        },
        {
          provide: ISensors,
          useFactory: (...sensors: any) => {
            return sensors;
          },
          inject: [TestingSensor],
        },
        {
          provide: IActors,
          useFactory: (...actors: any) => {
            return actors;
          },
          inject: [TestingActor],
        },
        {
          provide: PropertyMapper,
          useFactory: () => ({
            map: jest.fn().mockReturnValue({}),
          }),
        },
        {
          provide: TestingSensor,
          useFactory: () => {
            return new TestingSensor(sensorValidateStub);
          },
        },
        {
          provide: TestingActor,
          useFactory: () => {
            return new TestingActor(actorValidateStub);
          },
        },
      ],
    }).compile();

    service = moduleRef.get(DeviceTypesService);
    mapperSpy = moduleRef.get(PropertyMapper);
  });

  describe('getDeviceTypes', () => {
    it('should map the properties', async () => {
      await service.getDeviceTypes();
      expect(mapperSpy.map).toHaveBeenCalled();
    });
  });

  describe('getRawDeviceTypeById', () => {
    it('should return the raw device type', async () => {
      const deviceType = await service.getRawDeviceTypeById('testing-device');
      expect(deviceType).toBeInstanceOf(TestingDevice);
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

  describe('getSensors', () => {
    it('should return the sensors for a valid device', async () => {
      const sensors = await service.getSensors('testing-device');
      expect(sensors).toMatchObject([
        {
          properties: [{}],
          type: 'testing-sensor',
        },
      ]);
    });

    it('should error if the device type is invalid', async () => {
      try {
        await service.getSensors('unknown-device');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDeviceTypeError);
      }
    });
  });

  describe('getActors', () => {
    it('should return the actors for a valid device', async () => {
      const actors = await service.getActors('testing-device');

      expect(actors).toMatchObject([
        {
          properties: [{}],
          type: 'testing-actor',
        },
      ]);
    });

    it('should error if the device type is invalid', async () => {
      try {
        await service.getActors('unknown-device');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidDeviceTypeError);
      }
    });
  });

  describe('getRawSensorById', () => {
    it('should return the raw sensor', async () => {
      const sensor = await service.getRawSensorTypeById(
        'testing-device',
        'testing-sensor',
      );
      expect(sensor).toBeInstanceOf(TestingSensor);
    });
  });

  describe('getRawActorById', () => {
    it('should return the raw actor', async () => {
      const actor = await service.getRawActorTypeById(
        'testing-device',
        'testing-actor',
      );
      expect(actor).toBeInstanceOf(TestingActor);
    });
  });

  describe('validateSensorConfig', () => {
    it('should call the sensor validator', async () => {
      await service.validateSensorConfig(
        'testing-device',
        'testing-sensor',
        {},
      );
      expect(sensorValidateStub).toHaveBeenCalled();
    });
  });

  describe('validateActorConfig', () => {
    it('should call the actor validator function', async () => {
      await service.validateActorConfig('testing-device', 'testing-actor', {});
      expect(actorValidateStub).toHaveBeenCalled();
    });
  });
});

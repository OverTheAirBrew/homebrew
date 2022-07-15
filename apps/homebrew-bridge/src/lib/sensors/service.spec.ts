import { SensorService } from './service';

import { Test } from '@nestjs/testing';
import { TestingSensor } from '../../../test/utils/test-providers/sensor';
import { ISensors } from '../constants';

describe('lib/sensors/service', () => {
  let service: SensorService;

  let processStub: jest.Mock;

  beforeEach(async () => {
    processStub = jest.fn().mockReturnValue(10);

    const moduleRef = await Test.createTestingModule({
      providers: [
        SensorService,
        {
          provide: ISensors,
          useFactory: () => {
            return [
              new TestingSensor(async () => {
                return false;
              }, processStub),
            ];
          },
        },
      ],
    }).compile();

    service = moduleRef.get(SensorService);
  });

  describe('getReading', () => {
    it('should return a reading if the sensor is valid', async () => {
      await service.getReading('testing-sensor', {});
      expect(processStub).toHaveBeenCalled();
    });

    it('should return an error if the sensor type is invalid', async () => {
      try {
        await service.getReading('unknown-sensor', {});
        fail('should not reach this point');
      } catch (err) {
        expect(err.message).toBe('Sensor unknown-sensor not found');
      }
    });
  });

  describe('getSensorAddresses', () => {
    it('should return the sensor addresses', async () => {
      const values = await service.getSensorAddresses('testing-sensor');
      expect(values).toMatchObject(['12']);
    });

    it('should return an error if the sensor type is invalid', async () => {
      try {
        await service.getSensorAddresses('unknown-sensor');
        fail('should not reach this point');
      } catch (err) {
        expect(err.message).toBe('Sensor unknown-sensor not found');
      }
    });
  });
});

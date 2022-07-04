import { Test } from '@nestjs/testing';
import { TelemetryRepository } from '../../constants';
import { NoTelemetryForSensorError } from '../../errors/no-telemetry-for-sensor-error';
import { TelemetryService } from './service';

describe('telemetry-service', () => {
  let service: TelemetryService;

  let createTelemetryStub: jest.Mock;
  let findOneStub: jest.Mock;

  beforeEach(async () => {
    createTelemetryStub = jest.fn().mockResolvedValue({});
    findOneStub = jest.fn().mockResolvedValue(null);

    let moduleRef = await Test.createTestingModule({
      imports: [TelemetryService],
    })
      .useMocker((token) => {
        if (token === TelemetryRepository) {
          return {
            create: createTelemetryStub,
            findOne: findOneStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(TelemetryService);
  });

  describe('createTelemetry', () => {
    it('it should save the reading', async () => {
      await service.createTelemetry('sensor_id', 1234);

      expect(createTelemetryStub.mock.calls).toHaveLength(1);
      expect(createTelemetryStub.mock.calls[0][0]).toStrictEqual({
        sensor_id: 'sensor_id',
        reading: 1234,
      });
    });
  });

  describe('getLatestValue', () => {
    it('should retrieve the latest value', async () => {
      findOneStub.mockResolvedValue({ reading: 10 });

      const reading = await service.getLatestValue('');
      expect(reading).toBe(10);
    });

    it('should throw an error when there is no telemetry', async () => {
      try {
        await service.getLatestValue('');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(NoTelemetryForSensorError);
      }
    });
  });
});

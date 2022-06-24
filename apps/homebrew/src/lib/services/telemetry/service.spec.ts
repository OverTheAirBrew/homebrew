import { Test } from '@nestjs/testing';
import { TelemetryRepository } from '../../../lib/constants';
import { TelemetryService } from './service';

describe('telemetry-service', () => {
  let service: TelemetryService;

  let createTelemetryStub: jest.Mock;

  beforeEach(async () => {
    createTelemetryStub = jest.fn().mockResolvedValue({});

    let moduleRef = await Test.createTestingModule({
      imports: [TelemetryService],
    })
      .useMocker((token) => {
        if (token === TelemetryRepository) {
          return {
            create: createTelemetryStub,
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
});

import { Test } from '@nestjs/testing';
import { SensorService } from '../lib/services/sensor/service';
import { SensorReadingsCronService } from './sensor-readings';

describe('cron/sensor-readings', () => {
  let service: SensorReadingsCronService;

  let processSensorReadingsStub: jest.Mock;

  beforeEach(async () => {
    processSensorReadingsStub = jest.fn().mockResolvedValue({});

    const moduleRef = await Test.createTestingModule({
      providers: [
        SensorReadingsCronService,
        {
          provide: SensorService,
          useFactory: () => ({
            processSensorReadings: processSensorReadingsStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(SensorReadingsCronService);
  });

  describe('getSensorReadings', () => {
    it('should tell the service to process the sensor readings', async () => {
      await service.getSensorReadings();
      expect(processSensorReadingsStub.mock.calls).toHaveLength(1);
    });
  });
});

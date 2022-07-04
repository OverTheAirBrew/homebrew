import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { LockingModule } from '@ota-internal/locking';
import { SensorReadingsCronService } from '../../../src/app/cron/sensor-readings';
import { DatabaseModule } from '../../../src/database/module';
import { ServicesModule } from '../../../src/lib/services/module';
import { NewSensorReading } from '../../../src/models/events/new-sensor-reading';
import { cleanup, IRepositories } from '../../utils/cleanup';

describe('sensor-readings', () => {
  let service: SensorReadingsCronService;

  let emitSpy: jest.SpyInstance;
  let repositories: IRepositories;

  beforeEach(async () => {
    emitSpy = jest.spyOn(EventEmitter2.prototype, 'emit');

    const moduleRef = await Test.createTestingModule({
      providers: [SensorReadingsCronService],
      imports: [
        ServicesModule,
        EventEmitterModule.forRoot(),
        DatabaseModule,
        LockingModule,
      ],
    }).compile();

    service = moduleRef.get(SensorReadingsCronService);
    repositories = await cleanup(moduleRef);
  });

  describe('getSensorReadings', () => {
    it('should fire an event for each sensor', async () => {
      const { id: deviceId } = await repositories.devices.create({
        name: 'test',
        type_id: 'local-device',
      });

      const [{ id: sensorId }] = await repositories.sensors.bulkCreate([
        {
          name: 'sensor1',
          device_id: deviceId,
          type_id: 'dummy-sensor',
          config: {
            values: '1',
          },
        },
      ]);

      await service.getSensorReadings();

      expect(emitSpy.mock.calls).toHaveLength(1);
      expect(emitSpy.mock.calls).toMatchObject([
        [
          NewSensorReading.Channel,
          {
            sensor_id: sensorId,
            reading: 1,
          },
        ],
      ]);
    });
  });
});

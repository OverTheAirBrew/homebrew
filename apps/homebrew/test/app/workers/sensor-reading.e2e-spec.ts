import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CachingModule } from '@ota-internal/caching';
import { LockingModule } from '@ota-internal/locking';
import { SensorReadingWorkerService } from '../../../src/app/workers/sensor-reading';
import { DatabaseModule } from '../../../src/database/module';
import { ServicesModule } from '../../../src/lib/services/module';
import { cleanup, IRepositories } from '../../utils/cleanup';

describe('sensor-reading (e2e)', () => {
  let service: SensorReadingWorkerService;
  let repositories: IRepositories;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SensorReadingWorkerService],
      imports: [
        ServicesModule,
        EventEmitterModule.forRoot(),
        DatabaseModule,
        CachingModule,
        LockingModule,
      ],
    }).compile();

    service = moduleRef.get(SensorReadingWorkerService);
    repositories = await cleanup(moduleRef);
  });

  it('saveSensorTelemetry', async () => {
    const { id: device_id } = await repositories.devices.create({
      name: 'test',
      type_id: 'local-device',
    });

    const { id: sensor_id } = await repositories.sensors.create({
      name: 'sensor_1',
      device_id,
      type_id: 'dummy-sensor',
      config: {},
    });

    await service.saveSensorTelemetry({
      sensor_id,
      reading: 10,
    });

    const refetchedTelemetry = await repositories.telemetry.findAll({
      where: {
        sensor_id,
      },
    });

    expect(refetchedTelemetry).toHaveLength(1);
    expect(refetchedTelemetry[0].reading).toBe(10);
  });
});

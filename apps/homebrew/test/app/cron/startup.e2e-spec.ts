import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { LockingModule } from '@ota-internal/locking';
import { StartupEvents } from '../../../src/app/cron/startup';
import { DatabaseModule } from '../../../src/database/module';
import { ServicesModule } from '../../../src/lib/services/module';
import { ProcessKettleLogic } from '../../../src/models/events/process-kettle-logic';
import { cleanup, IRepositories } from '../../utils/cleanup';

describe('cron/startup', () => {
  let service: StartupEvents;

  let emitStub: jest.SpyInstance;

  let repositories: IRepositories;

  beforeEach(async () => {
    emitStub = jest.spyOn(EventEmitter2.prototype, 'emit');

    let moduleRef = await Test.createTestingModule({
      providers: [StartupEvents],
      imports: [
        ServicesModule,
        EventEmitterModule.forRoot(),
        DatabaseModule,
        LockingModule,
      ],
    }).compile();

    service = moduleRef.get(StartupEvents);

    repositories = await cleanup(moduleRef);
  });

  describe('startWorkers', () => {
    it('should fire an event for each worker', async () => {
      const { id: deviceId } = await repositories.devices.create({
        name: 'test',
        type_id: 'local-device',
      });

      const [[{ id: sensorId }], [{ id: actorId }]] = await Promise.all([
        repositories.sensors.bulkCreate([
          {
            name: 'sensor1',
            device_id: deviceId,
            type_id: 'one-wire-sensor',
            config: {},
          },
        ]),
        repositories.actors.bulkCreate([
          {
            name: 'actor1',
            device_id: deviceId,
            type_id: 'gpio-actor',
            config: {},
          },
        ]),
      ]);

      const [{ id: kettle1 }, { id: kettle2 }] =
        await repositories.kettles.bulkCreate([
          {
            name: 'kettle1',
            sensor_id: sensorId,
            heater_id: actorId,
            logicType_id: 'pid-logic',
            logicRun_id: 'logic_run_id',
            config: {},
          },
          {
            name: 'kettle2',
            sensor_id: sensorId,
            heater_id: actorId,
            logicType_id: 'pid-logic',
            logicRun_id: 'logic_run_id',
            config: {},
          },
          {
            name: 'kettle3',
            sensor_id: sensorId,
            heater_id: actorId,
            logicType_id: 'pid-logic',
            logicRun_id: undefined,
            config: {},
          },
        ]);

      await service.startWorkers();

      expect(emitStub.mock.calls).toHaveLength(2);
      expect(emitStub.mock.calls).toMatchObject([
        [
          ProcessKettleLogic.Channel,
          {
            kettle_id: kettle1,
            logicType: 'pid-logic',
            config: {},
            run_id: 'logic_run_id',
          },
        ],
        [
          ProcessKettleLogic.Channel,
          {
            kettle_id: kettle2,
            logicType: 'pid-logic',
            config: {},
            run_id: 'logic_run_id',
          },
        ],
      ]);
    });
  });
});

import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { LockModule, LockService } from '@s1seven/nestjs-tools-lock';
import { KettleWorkingService } from '../../../src/app/workers/kettle-working';
import { DatabaseModule } from '../../../src/database/module';
import { ServicesModule } from '../../../src/lib/services/module';
import { cleanup, IRepositories } from '../../utils/cleanup';

describe('kettle-working', () => {
  let service: KettleWorkingService;

  let emitSpy: jest.SpyInstance;
  let repositories: IRepositories;

  beforeEach(async () => {
    emitSpy = jest.spyOn(EventEmitter2.prototype, 'emit');

    const moduleRef = await Test.createTestingModule({
      providers: [KettleWorkingService, LockService],
      imports: [
        ServicesModule,
        EventEmitterModule.forRoot(),
        DatabaseModule,
        LockModule.forRoot({}),
      ],
    }).compile();

    service = moduleRef.get(KettleWorkingService);
    repositories = await cleanup(moduleRef);
  });

  describe('processKettleLogic', () => {
    it('', async () => {
      const { id: device_id } = await repositories.devices.create({
        name: 'local-device',
        type_id: 'local-device',
        config: {},
      });

      const [{ id: sensor_id }, { id: actor_id }] = await Promise.all([
        repositories.sensors.create({
          name: 'sensor',
          device_id,
          type_id: 'one-wire-sensor',
          config: {
            sensorAddress: 'ABCD',
          },
        }),
        repositories.actors.create({
          name: 'actor',
          device_id,
          type_id: 'gpio-actor',
          config: {
            gpioNumber: 1,
          },
        }),
      ]);

      const {
        id: kettle_id,
        logicRun_id,
        logicType_id,
        config,
      } = await repositories.kettles.create({
        name: 'kettle',
        sensor_id,
        heater_id: actor_id,
        logicType_id: 'pid-logic',
        config: {
          p: 1,
          i: 1,
          d: 1,
        },
        logicRun_id: 'run_id',
        targetTemperature: 100,
      });

      await service.processKettleLogic({
        kettle_id,
        logicType: logicType_id,
        run_id: logicRun_id,
        config,
      });

      expect(emitSpy.mock.calls).toHaveLength(1);
    });
  });
});

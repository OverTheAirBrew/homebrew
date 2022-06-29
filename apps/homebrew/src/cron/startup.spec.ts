import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { KettleService } from '../lib/services/kettle/service';
import { ProcessKettleLogic } from '../models/events/process-kettle-logic';
import { StartupEvents } from './startup';

describe('cron/startup', () => {
  let service: StartupEvents;

  let emitStub: jest.Mock;

  beforeEach(async () => {
    emitStub = jest.fn().mockResolvedValue({});

    const getRunningKettlesStub = jest.fn().mockResolvedValue([
      {
        id: 'kettle_id',
        logicType_id: 'logic_type_id',
        config: {},
        logicRun_id: 'logic_run_id',
      },
      {
        id: 'kettle_id2',
        logicType_id: 'logic_type_id',
        config: {},
        logicRun_id: 'logic_run_id',
      },
    ]);

    let moduleRef = await Test.createTestingModule({
      providers: [
        StartupEvents,
        {
          provide: KettleService,
          useFactory: () => ({
            getRunningKettles: getRunningKettlesStub,
          }),
        },
        {
          provide: EventEmitter2,
          useFactory: () => ({
            emit: emitStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(StartupEvents);
  });

  describe('startWorkers', () => {
    it('should fire an event for each worker', async () => {
      await service.startWorkers();

      expect(emitStub.mock.calls).toHaveLength(2);

      expect(emitStub.mock.calls).toMatchObject([
        [
          ProcessKettleLogic.Channel,
          {
            kettle_id: 'kettle_id',
            logicType: 'logic_type_id',
            config: {},
            run_id: 'logic_run_id',
          },
        ],
        [
          ProcessKettleLogic.Channel,
          {
            kettle_id: 'kettle_id2',
            logicType: 'logic_type_id',
            config: {},
            run_id: 'logic_run_id',
          },
        ],
      ]);
    });
  });
});

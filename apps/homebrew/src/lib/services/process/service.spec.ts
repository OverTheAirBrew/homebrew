import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { ILockingClient } from '@ota-internal/locking';
import { ProcessKettleLogic } from '../../../models/events/process-kettle-logic';
import { ActorTypesService } from '../actor-types/service';
import { DeviceService } from '../device/service';
import { KettleService } from '../kettle/service';
import { LogicTypesService } from '../logic-types/service';
import { ProcessService } from './service';

const BASE_KETTLE = { targetTemperature: 10, logicRun_id: 'valid_run_id' };

describe('lib/process', () => {
  let service: ProcessService;

  let lockStub: jest.Mock;
  let unlockStub: jest.Mock;

  let getKettleStub: jest.Mock;
  let toggleKettleWorkingStub: jest.Mock;

  let getRawLogicTypeByIdStub: jest.Mock;

  let getDeviceByIdStub: jest.Mock;

  let getRawActorTypeStub: jest.Mock;
  let actorOnStub: jest.Mock;
  let actorOffStub: jest.Mock;

  let logicTypeRunStub: jest.Mock;

  let emitStub: jest.Mock;

  beforeEach(async () => {
    unlockStub = jest.fn();
    lockStub = jest.fn().mockResolvedValue({
      unlock: unlockStub,
    });

    getKettleStub = jest.fn().mockResolvedValue({
      ...BASE_KETTLE,
      sensor: {
        telemetries: [
          {
            reading: 10,
          },
        ],
      },
      heater: {
        device_id: 'device_id',
      },
    });

    toggleKettleWorkingStub = jest.fn().mockResolvedValue({});

    getRawLogicTypeByIdStub = jest.fn().mockResolvedValue({
      run: logicTypeRunStub,
    });

    getDeviceByIdStub = jest.fn().mockResolvedValue({
      type_id: 'deviceType_id',
    });

    actorOnStub = jest.fn();
    actorOffStub = jest.fn();

    getRawActorTypeStub = jest.fn().mockResolvedValue({
      on: actorOnStub,
      off: actorOffStub,
    });

    logicTypeRunStub = jest.fn().mockResolvedValue({
      heatTime: 10,
      waitTime: 10,
      nextParams: {
        newParam: 10,
      },
    });

    emitStub = jest.fn().mockResolvedValue({});

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProcessService,
        {
          provide: KettleService,
          useValue: {
            getRawKettleWithInclusions: getKettleStub,
            toggleKettleWorking: toggleKettleWorkingStub,
          },
        },
        {
          provide: LogicTypesService,
          useValue: {
            getRawLogicTypeById: getRawLogicTypeByIdStub,
          },
        },
        {
          provide: ActorTypesService,
          useValue: {
            getRawActorTypeById: getRawActorTypeStub,
          },
        },
        {
          provide: DeviceService,
          useValue: {
            getDeviceById: getDeviceByIdStub,
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: emitStub,
          },
        },
        {
          provide: ILockingClient,
          useValue: {
            lock: lockStub,
          },
        },
      ],
    }).compile();

    service = moduleRef.get<ProcessService>(ProcessService);
  });

  describe('processKettleLogic', () => {
    it('should toggle off the kettle if there is no target temperature', async () => {
      getKettleStub.mockResolvedValue({
        ...BASE_KETTLE,
        targetTemperature: undefined,
      });

      await service.processKettleLogic(
        'kettle_id',
        'logic_type_id',
        {},
        'valid_run_id',
      );

      expect(toggleKettleWorkingStub).toHaveBeenCalledWith('kettle_id');
      expect(unlockStub).toHaveBeenCalled();
      expect(getRawLogicTypeByIdStub).not.toHaveBeenCalled();
    });

    it('should stop the run if the run_ids do not match', async () => {
      await service.processKettleLogic(
        'kettle_id',
        'logic_type_id',
        {},
        'invalid_run_id',
      );

      expect(unlockStub).toHaveBeenCalled();
      expect(getRawLogicTypeByIdStub).not.toHaveBeenCalled();
    });

    it('should stop the run if the kettle no longer has a run_id', async () => {
      getKettleStub.mockResolvedValue({
        ...BASE_KETTLE,
        run_id: undefined,
      });

      await service.processKettleLogic(
        'kettle_id',
        'logic_type_id',
        {},
        'invalid_run_id',
      );

      expect(unlockStub).toHaveBeenCalled();
      expect(getRawLogicTypeByIdStub).not.toHaveBeenCalled();
    });

    it('it should process the kettle and resubmit with the new params', async () => {
      await service.processKettleLogic(
        'kettle_id',
        'logic_type_id',
        {},
        'valid_run_id',
      );

      // ENABLE ONCE A DUMMY-ACTOR can be created
      // expect(actorOnStub).toHaveBeenCalledTimes(1);
      // expect(actorOffStub).toHaveBeenCalledTimes(1);

      expect(emitStub).toHaveBeenCalledTimes(1);
      expect(emitStub.mock.calls[0]).toMatchObject([
        ProcessKettleLogic.Channel,
        {
          kettle_id: 'kettle_id',
          logicType: 'logic_type_id',
          config: {
            newParam: 10,
          },
          run_id: 'valid_run_id',
        },
      ]);

      expect(unlockStub).toHaveBeenCalled();
    });
  });
});

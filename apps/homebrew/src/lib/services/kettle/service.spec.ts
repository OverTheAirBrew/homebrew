import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { v4 as uuid } from 'uuid';
import { Kettle } from '../../../database/models/kettle';
import { KettleRepository } from '../../../lib/constants';
import { KettleNotFoundError } from '../../../lib/errors/kettle-not-found-error';
import { KettleDto } from '../../../models/dto/kettle.dto';
import { ProcessKettleLogic } from '../../../models/events/process-kettle-logic';
import { KettleInIncorrectStateToWork } from '../../errors/kettle-in-incorrect-state-to-work';
import { KettleService } from './service';

describe('kettle-service', () => {
  let service: KettleService;
  let repository: typeof Kettle;

  let createdKettleId: string;

  let createKettleStub: jest.Mock;
  let findAllStub: jest.Mock;
  let updateStub: jest.Mock;
  let findByPkStub: jest.Mock;

  let emitStub: jest.Mock;

  beforeEach(async () => {
    createdKettleId = uuid();

    createKettleStub = jest.fn().mockReturnValue({
      id: createdKettleId,
    });

    findAllStub = jest.fn().mockReturnValue([
      {
        id: 'id1',
        name: 'name1',
        sensor_id: 'sensor_id1',
        heater_id: 'heater_id1',
        logicType_id: 'logicType_id1',
        config: '{}',
      },
    ]);

    updateStub = jest.fn();

    findByPkStub = jest.fn();

    when(findByPkStub).calledWith('id1').mockReturnValue({
      update: updateStub,
      save: jest.fn(),
    });

    when(findByPkStub).calledWith('id2').mockReturnValue(null);

    emitStub = jest.fn().mockReturnValue({});

    const moduleRef = await Test.createTestingModule({
      providers: [
        KettleService,
        {
          provide: KettleRepository,
          useFactory: () => ({
            create: createKettleStub,
            findAll: findAllStub,
            findByPk: findByPkStub,
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

    service = moduleRef.get(KettleService);
    repository = moduleRef.get(KettleRepository);
  });

  describe('createKettle', () => {
    it('should create and return the id of the kettle', async () => {
      const id = await service.createKettle('name');
      expect(id).toBe(createdKettleId);

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: undefined,
        heater_id: undefined,
        logicType_id: undefined,
        config: undefined,
      });
    });

    it('should pass the sensor_id to the create call', async () => {
      await service.createKettle('name', 'sensor_id');

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: 'sensor_id',
        heater_id: undefined,
        logicType_id: undefined,
        config: undefined,
      });
    });

    it('should pass the heater_id to the create call', async () => {
      await service.createKettle('name', undefined, 'heater_id');

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: undefined,
        heater_id: 'heater_id',
        logicType_id: undefined,
        config: undefined,
      });
    });

    it('should pass the logicType_id to the create call', async () => {
      await service.createKettle('name', undefined, undefined, 'logicType_id');

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: undefined,
        heater_id: undefined,
        logicType_id: 'logicType_id',
        config: undefined,
      });
    });

    it('should pass the config to the create call', async () => {
      await service.createKettle('name', undefined, undefined, undefined, {});

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: undefined,
        heater_id: undefined,
        logicType_id: undefined,
        config: {},
      });
    });
  });

  describe('getKettles', () => {
    it('should return all kettles', async () => {
      const kettles = await service.getKettles();

      expect(kettles).toHaveLength(1);

      expect(kettles).toMatchObject([
        {
          id: 'id1',
          name: 'name1',
          sensor_id: 'sensor_id1',
          heater_id: 'heater_id1',
          logicType_id: 'logicType_id1',
          config: {},
        },
      ]);
    });

    it('should return a kettle even when it has undefined config', async () => {
      findAllStub.mockReturnValue([
        {
          id: 'id1',
          name: 'name1',
          sensor_id: 'sensor_id1',
          heater_id: 'heater_id1',
          logicType_id: 'logicType_id1',
          config: undefined,
        },
      ]);

      const kettles = await service.getKettles();

      expect(kettles).toHaveLength(1);

      expect(kettles).toMatchObject([
        {
          id: 'id1',
          name: 'name1',
          sensor_id: 'sensor_id1',
          heater_id: 'heater_id1',
          logicType_id: 'logicType_id1',
          config: {},
        },
      ]);
    });
  });

  describe('updateKettle', () => {
    it('should update the name', async () => {
      await service.updateKettle(
        'id1',
        new KettleDto(
          '',
          'name',
          'sensor_id',
          'heater_id',
          'logicType_id',
          1,
          'logicRun_id',
          {},
        ),
      );

      expect(updateStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: 'sensor_id',
        heater_id: 'heater_id',
        logicType_id: 'logicType_id',
        config: {},
      });
    });

    it('should throw an error if no kettle with the id is found', async () => {
      findByPkStub.mockReturnValue(undefined);

      expect(async () => {
        await service.updateKettle(
          'id1',
          new KettleDto(
            '',
            'name',
            'sensor_id',
            'heater_id',
            'logicType_id',
            1,
            'logicRun_id',
            {},
          ),
        );
      }).rejects.toThrow(KettleNotFoundError);
    });
  });

  describe('getKettleById', () => {
    it('should return the kettle with the id', async () => {
      const kettle = await service.getKettleById('id1');
      expect(kettle).toMatchObject({});
    });

    it('should throw an error if the kettle is not found', async () => {
      try {
        await service.getKettleById('id2');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleNotFoundError);
      }
    });
  });

  describe('toggleKettleWorking', () => {
    const fullKettle: Partial<Kettle> = {
      id: 'id1',
      sensor_id: 'sensor_id',
      heater_id: 'heater_id',
      logicType_id: 'logicType_id',
      targetTemperature: 1,
      logicRun_id: 'logicRun_id',
      config: {},
    };

    it('should toggle the kettle if its not null', async () => {
      const saveStub = jest.fn().mockResolvedValue({
        ...fullKettle,
      });

      findByPkStub.mockResolvedValue({
        ...fullKettle,
        logicRun_id: undefined,
        update: updateStub,
        save: saveStub,
      });

      await service.toggleKettleWorking('id1');

      expect(updateStub.mock.calls).toHaveLength(1);
      expect(updateStub.mock.calls[0][0]).toHaveProperty('logicRun_id');
      expect(updateStub.mock.calls[0][0].logicType_id).not.toBeNull();

      expect(emitStub.mock.calls).toHaveLength(1);
      expect(emitStub.mock.calls[0]).toMatchObject([
        ProcessKettleLogic.Channel,
        {
          kettle_id: 'id1',
          logicType: 'logicType_id',
          config: {},
          run_id: 'logicRun_id',
        },
      ]);
    });

    it('should set the logicRun_id to null if it is set', async () => {
      const saveStub = jest.fn().mockResolvedValue({
        ...fullKettle,
        logicRun_id: undefined,
      });

      findByPkStub.mockResolvedValue({
        ...fullKettle,
        logicRun_id: 'logicRun_id',
        update: updateStub,
        save: saveStub,
      });

      await service.toggleKettleWorking('id1');

      expect(updateStub.mock.calls).toHaveLength(1);
      expect(updateStub.mock.calls[0][0]).toHaveProperty('logicRun_id');

      expect(updateStub.mock.calls[0][0].logicType_id).toBeUndefined();

      expect(emitStub.mock.calls).toHaveLength(0);
    });

    it('should throw an error if the kettle does not exist', async () => {
      findByPkStub.mockResolvedValue(null);

      try {
        await service.toggleKettleWorking('id1');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleNotFoundError);
      }
    });

    it('should throw an error when there is no sensor_id on the kettle and the logic is been enabled', async () => {
      findByPkStub.mockResolvedValue({
        ...fullKettle,
        sensor_id: undefined,
        logicRun_id: undefined,
      });

      try {
        await service.toggleKettleWorking('id1');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleInIncorrectStateToWork);
      }
    });

    it('should throw an error when there is no heater_id on the kettle', async () => {
      findByPkStub.mockResolvedValue({
        ...fullKettle,
        heater_id: undefined,
        logicRun_id: undefined,
      });

      try {
        await service.toggleKettleWorking('id1');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleInIncorrectStateToWork);
      }
    });

    it('should throw an error when there is no logicType_id on the kettle', async () => {
      findByPkStub.mockResolvedValue({
        ...fullKettle,
        logicType_id: undefined,
        logicRun_id: undefined,
      });

      try {
        await service.toggleKettleWorking('id1');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleInIncorrectStateToWork);
      }
    });

    it('should throw an error when there is no targetTemperature on the kettle', async () => {
      findByPkStub.mockResolvedValue({
        ...fullKettle,
        targetTemperature: undefined,
        logicRun_id: undefined,
      });

      try {
        await service.toggleKettleWorking('id1');
        fail('should have thrown an error');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleInIncorrectStateToWork);
      }
    });
  });

  describe('getRunningKettles', () => {
    it('should return a list of kettles', async () => {
      const kettles = await service.getRunningKettles();
      expect(kettles).toHaveLength(1);
    });
  });

  describe('getRawKettleWithInclusions', () => {
    it('should throw an error when there are no kettles', async () => {
      findByPkStub.mockResolvedValue(undefined);

      try {
        await service.getRawKettleWithInclusions('id1');
        fail('should have failed');
      } catch (err) {
        expect(err).toBeInstanceOf(KettleNotFoundError);
      }
    });

    it('should return a kettle', async () => {
      findByPkStub.mockResolvedValue({
        id: 'id1',
        sensor_id: 'sensor_id',
        heater_id: 'heater_id',
        logicType_id: 'logicType_id',
        targetTemperature: 1,
        logicRun_id: 'logicRun_id',
        config: {},
      });

      const kettle = await service.getRawKettleWithInclusions('id1');
      expect(kettle).toBeDefined();
    });
  });
});

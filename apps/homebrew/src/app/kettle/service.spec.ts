import { Test } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { Kettle } from '../../database/models/kettle';
import { KettleRepository } from '../../lib/constants';
import { KettleNotFoundError } from '../../lib/errors/kettle-not-found-error';
import { KettleDto } from '../../models/dto/kettle.dto';
import { KettleService } from './service';

describe('kettle-service', () => {
  let service: KettleService;
  let repository: typeof Kettle;

  let createdKettleId: string;

  let createKettleStub: jest.Mock;
  let findAllStub: jest.Mock;
  let updateStub: jest.Mock;
  let findByPkStub: jest.Mock;

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

    findByPkStub = jest.fn().mockReturnValue({
      update: updateStub,
      save: jest.fn(),
    });

    const moduleRef = await Test.createTestingModule({
      providers: [KettleService],
    })
      .useMocker((token) => {
        if (token === KettleRepository) {
          return {
            create: createKettleStub,
            findAll: findAllStub,
            findByPk: findByPkStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(KettleService);
    repository = moduleRef.get(KettleRepository);
  });

  describe('createKettle', () => {
    it('should create and return the id of the kettle', async () => {
      const kettleId = await service.createKettle('name');
      expect(kettleId).toBe(createdKettleId);

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
      const kettleId = await service.createKettle('name', 'sensor_id');
      expect(kettleId).toBe(createdKettleId);

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
      const kettleId = await service.createKettle(
        'name',
        undefined,
        'heater_id',
      );
      expect(kettleId).toBe(createdKettleId);

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
      const kettleId = await service.createKettle(
        'name',
        undefined,
        undefined,
        'logicType_id',
      );
      expect(kettleId).toBe(createdKettleId);

      expect(createKettleStub.mock.calls).toHaveLength(1);
      expect(createKettleStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        sensor_id: undefined,
        heater_id: undefined,
        logicType_id: 'logicType_id',
        config: undefined,
      });
    });

    it('should pass the logicType_id to the create call', async () => {
      const kettleId = await service.createKettle(
        'name',
        undefined,
        undefined,
        undefined,
        {},
      );
      expect(kettleId).toBe(createdKettleId);

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
        '1',
        new KettleDto('', 'name', 'sensor_id', 'heater_id', 'logicType_id', {}),
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
          '1',
          new KettleDto(
            '',
            'name',
            'sensor_id',
            'heater_id',
            'logicType_id',
            {},
          ),
        );
      }).rejects.toThrow(KettleNotFoundError);
    });
  });
});

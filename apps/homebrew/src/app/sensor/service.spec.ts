import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { v4 as uuid } from 'uuid';
import { Sensor } from '../../database/models/sensor';
import { SensorRepository } from '../../lib/constants';
import { SensorDoesNotExistError } from '../../lib/errors/sensor-does-not-exist-error copy';
import { SensorService } from './service';

describe('sensor-service', () => {
  let service: SensorService;
  let repository: typeof Sensor;

  let createSensorId: string;

  let createSensorStub: jest.Mock;
  let findAllStub: jest.Mock;
  let findOneStub: jest.Mock;

  beforeEach(async () => {
    createSensorId = uuid();

    createSensorStub = jest.fn().mockReturnValue({
      id: createSensorId,
    });

    findAllStub = jest.fn().mockReturnValue([
      {
        id: 'id1',
        name: 'name1',
        type_id: 'type_id1',
        config: {},
      },
    ]);

    findOneStub = jest.fn();
    when(findOneStub).calledWith('id1').mockReturnValue({
      id: 'sensorId',
      name: 'name',
      type_id: 'type_id',
      config: {},
    });
    when(findOneStub).calledWith('id2').mockReturnValue(null);

    const moduleRef = await Test.createTestingModule({
      providers: [SensorService],
    })
      .useMocker((token) => {
        if (token === SensorRepository) {
          return {
            create: createSensorStub,
            findAll: findAllStub,
            findByPk: findOneStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(SensorService);
    repository = moduleRef.get(SensorRepository);
  });

  describe('createSensor', () => {
    it('should create and return the id of the sensor', async () => {
      const id = await service.createSensor('name');
      expect(id).toBe(createSensorId);

      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        type_id: undefined,
        config: undefined,
      });
    });

    it('should pass the type_id to the create sensor', async () => {
      await service.createSensor('name', 'type_id');

      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        type_id: 'type_id',
        config: undefined,
      });
    });

    it('should pass the config to the create sensor call', async () => {
      await service.createSensor('name', 'type_id', {});
      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        type_id: 'type_id',
        config: {},
      });
    });
  });

  describe('getSensors', () => {
    it('should return all sensors', async () => {
      const sensors = await service.getSensors();
      expect(sensors).toMatchObject([
        {
          id: 'id1',
          name: 'name1',
          type_id: 'type_id1',
          config: {},
        },
      ]);
    });

    it('should return a sensor even when the config is undefined', async () => {
      findAllStub.mockReturnValue([
        {
          id: 'id1',
          name: 'name1',
          type_id: 'type_id1',
          config: undefined,
        },
      ]);

      const sensors = await service.getSensors();

      expect(sensors).toHaveLength(1);

      expect(sensors).toMatchObject([
        {
          id: 'id1',
          name: 'name1',
          type_id: 'type_id1',
          config: {},
        },
      ]);
    });
  });

  describe('getSensorById', () => {
    it('should return the sensor', async () => {
      const sensor = await service.getSensorById('id1');
      expect(sensor).toMatchObject({
        id: 'sensorId',
        name: 'name',
        type_id: 'type_id',
        config: {},
      });
    });

    it('should throw an error when the sensor is not found', async () => {
      try {
        await service.getSensorById('id2');
        fail('should not reach this point');
      } catch (err) {
        expect(err).toBeInstanceOf(SensorDoesNotExistError);
      }
    });
  });
});

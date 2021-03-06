import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { when } from 'jest-when';
import { v4 as uuid } from 'uuid';
import { DeviceRepository, SensorRepository } from '../../../lib/constants';
import { SensorDoesNotExistError } from '../../errors/sensor-does-not-exist-error';
import { SensorTypesService } from '../sensor-types/service';

import { SensorService } from './service';

describe('sensor-service', () => {
  let service: SensorService;

  let createSensorId: string;

  let createSensorStub: jest.Mock;
  let findAllStub: jest.Mock;
  let findOneStub: jest.Mock;

  let eventEmitterStub: jest.Mock;
  let getRawSensorTypeStub: jest.Mock;

  beforeEach(async () => {
    createSensorId = uuid();

    eventEmitterStub = jest.fn();

    getRawSensorTypeStub = jest.fn().mockReturnValue({
      run: jest.fn().mockReturnValue(10),
    });

    createSensorStub = jest.fn().mockReturnValue({
      id: createSensorId,
    });

    findAllStub = jest.fn().mockReturnValue([
      {
        id: 'id1',
        name: 'name1',
        type_id: 'type_id1',
        config: {},
        device: {
          type_id: '1234',
        },
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

        if (token === DeviceRepository) {
          return {};
        }

        if (token === SensorTypesService) {
          return {
            getRawSensorTypeById: getRawSensorTypeStub,
          };
        }

        if (token === EventEmitter2) {
          return {
            emit: eventEmitterStub,
          };
        }
      })
      .compile();

    service = moduleRef.get(SensorService);
  });

  describe('createSensor', () => {
    it('should create and return the id of the sensor', async () => {
      const id = await service.createSensor('name', 'device_id');
      expect(id).toBe(createSensorId);

      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        device_id: 'device_id',
        type_id: undefined,
        config: undefined,
      });
    });

    it('should pass the type_id to the create sensor', async () => {
      await service.createSensor('name', 'device_id', 'type_id');

      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        device_id: 'device_id',
        type_id: 'type_id',
        config: undefined,
      });
    });

    it('should pass the config to the create sensor call', async () => {
      await service.createSensor('name', 'device_id', 'type_id', {});
      expect(createSensorStub.mock.calls).toHaveLength(1);
      expect(createSensorStub.mock.calls[0][0]).toStrictEqual({
        name: 'name',
        device_id: 'device_id',
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

  describe('processSensorReadings', () => {
    it('should send an event per sensor', async () => {
      findAllStub.mockReturnValue([
        {
          id: 'id1',
          name: 'name1',
          type_id: 'type_id1',
          config: {},
          device: {
            type_id: 'device_type_id',
          },
        },
        {
          id: 'id2',
          name: 'name2',
          type_id: 'type_id2',
          config: {},
          device: {
            type_id: 'device_type_id2',
          },
        },
      ]);

      await service.processSensorReadings();

      expect(getRawSensorTypeStub.mock.calls).toHaveLength(2);

      expect(getRawSensorTypeStub.mock.calls[0]).toEqual([
        'device_type_id',
        'type_id1',
      ]);

      expect(getRawSensorTypeStub.mock.calls[1]).toEqual([
        'device_type_id2',
        'type_id2',
      ]);

      expect(eventEmitterStub.mock.calls).toHaveLength(2);

      expect(eventEmitterStub.mock.calls[0][1]).toMatchObject({
        sensor_id: 'id1',
        reading: 10,
      });

      expect(eventEmitterStub.mock.calls[1][1]).toMatchObject({
        sensor_id: 'id2',
        reading: 10,
      });
    });
  });
});

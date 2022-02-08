import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { MessagingManager } from '../../../../src/app/lib/messaging-manager';
import { IMessagingManager } from '../../../../src/app/lib/plugin/abstractions/messaging-manager';
import { SensorReading } from '../../../../src/app/lib/plugin/messages/events/sensor-reading';
import { SensorService } from '../../../../src/app/lib/sensor';
import { SensorTypesService } from '../../../../src/app/lib/sensor-types';
import { SensorRepository } from '../../../../src/app/lib/sensor/repository';
import { SensorValidator } from '../../../../src/app/lib/sensor/validator';
import { mockDatabase } from '../../utils/mock-database';

describe('lib/sensor', () => {
  let sensorService: SensorService;

  let validator: StubbedInstance<SensorValidator>;
  let sensorRepository: StubbedInstance<SensorRepository>;

  let sensorTypeService: StubbedInstance<SensorTypesService>;
  let measagingManager: StubbedInstance<IMessagingManager>;

  beforeEach(() => {
    mockDatabase();

    validator = stubConstructor(SensorValidator);
    sensorRepository = stubConstructor(SensorRepository);
    sensorRepository.createSensor.resolves('1234');

    sensorTypeService = stubConstructor(SensorTypesService);

    measagingManager = stubConstructor(MessagingManager);
    measagingManager.sendEvent.withArgs(SensorReading).returns(sinon.stub());

    sensorService = new SensorService(
      validator,
      sensorRepository,
      sensorTypeService,
      measagingManager,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllSensors', () => {
    it('should return mapped sensors', async () => {
      sensorRepository.getAllSensors.resolves([
        {
          id: 'id',
          name: 'name',
          type_id: 'type_id',
          config: JSON.stringify({ test: true }),
        },
      ]);

      const sensors = await sensorService.getAllSensors();
      expect(sensors).to.deep.eq([
        {
          id: 'id',
          name: 'name',
          type_id: 'type_id',
          config: {
            test: true,
          },
        },
      ]);
    });
  });

  describe('createNewSensor', () => {
    it('should save the sensor if the sensor is valid', async () => {
      validator.validateAsync.resolves({});
      validator.isValid.resolves(true);

      const { id } = await sensorService.createNewSensor({
        name: 'test',
        config: {},
        type_id: '1234',
      });

      expect(id).to.eq('1234');
      expect(sensorRepository.createSensor.callCount).to.eq(1);
    });

    it('should error if validation fails', async () => {
      validator.validateAsync.resolves({});
      validator.isValid.resolves(false);

      try {
        await sensorService.createNewSensor({
          name: 'test',
          config: {},
          type_id: '1234',
        });
        expect.fail('should not reach this point');
      } catch (err) {
        expect(err.message).to.eq('Invalid sensor');
      }
    });
  });

  describe('processLatestSensorReadings', () => {
    it('should not send the event if there is no value', async () => {
      sensorRepository.getAllSensors.resolves([
        {
          id: '1234',
          name: 'testing',
          type_id: 'testing',
          config: JSON.stringify({ testing: true }),
        },
      ]);

      const runstub = sinon.stub().resolves(undefined);

      sensorTypeService.getRawSensorTypeById.withArgs('testing').resolves({
        run: runstub,
      } as any);

      await sensorService.processLatestSensorReadings();

      expect(measagingManager.sendEvent.callCount).to.eq(0);
    });

    it('should run for each sensor', async () => {
      sensorRepository.getAllSensors.resolves([
        {
          id: '1234',
          name: 'testing',
          type_id: 'testing',
          config: JSON.stringify({ testing: true }),
        },
      ]);

      const runstub = sinon.stub().resolves(1);

      sensorTypeService.getRawSensorTypeById.withArgs('testing').resolves({
        run: runstub,
      } as any);

      await sensorService.processLatestSensorReadings();

      expect(runstub.callCount).to.eq(1);
      expect(runstub.firstCall.args).to.deep.eq(['1234', { testing: true }]);
    });
  });

  describe('getSensorById', () => {
    it('should return a mapped sensor', async () => {
      sensorRepository.getSensorById.resolves({
        id: '12345678',
        name: 'testing-sensor',
        type_id: 'testing-type',
        config: '{}',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const sensor = await sensorService.getSensorById('12345678');
      expect(sensor).to.deep.eq({
        id: '12345678',
        name: 'testing-sensor',
        type_id: 'testing-type',
        config: {},
      });
    });

    it('should throw an error if the sensor is not found', async () => {
      sensorRepository.getSensorById.resolves(undefined);

      try {
        await sensorService.getSensorById('12345678');
        expect.fail('should not reach this point');
      } catch (err) {
        expect(err.message).to.eq('sensor not found');
      }
    });
  });
});

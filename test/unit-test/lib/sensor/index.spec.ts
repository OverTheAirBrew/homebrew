import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { Logger } from '../../../../src/app/lib/logger';
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

  let logger: StubbedInstance<Logger>;

  beforeEach(() => {
    mockDatabase();

    validator = stubConstructor(SensorValidator);
    sensorRepository = stubConstructor(SensorRepository);
    sensorRepository.createSensor.resolves('1234');

    sensorTypeService = stubConstructor(SensorTypesService);

    logger = stubConstructor(Logger, {
      level: 'error',
      node_env: 'testing',
      serviceName: 'testing',
    });

    logger.error.returns();

    sensorService = new SensorService(
      validator,
      sensorRepository,
      sensorTypeService,
      logger,
    );
  });

  afterEach(() => {
    sinon.restore();
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

    it('should log if the sensortype is somehow invalid', async () => {
      sensorRepository.getAllSensors.resolves([
        {
          id: '1234',
          name: 'testing',
          type_id: 'testing',
          config: JSON.stringify({ testing: true }),
        },
      ]);

      sensorTypeService.getRawSensorTypeById
        .withArgs('testing')
        .throws(new Error('invalid sensor type'));

      await sensorService.processLatestSensorReadings();

      expect(logger.error.callCount).to.eq(1);
    });
  });
});

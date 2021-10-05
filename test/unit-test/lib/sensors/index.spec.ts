import { expect } from 'chai';
import {
  Severity,
  ValidationFailure,
  ValidationResult,
} from 'fluent-ts-validator';
import * as sinon from 'sinon';
import { StubbedInstance, stubConstructor } from 'ts-sinon';
import { SensorService } from '../../../../src/lib/sensors';
import { SensorRepository } from '../../../../src/lib/sensors/repository';
import { SensorValidator } from '../../../../src/lib/sensors/validation';
import { TelemetryRepository } from '../../../../src/lib/telemetry/repository';
import { SequelizeWrapper } from '../../../../src/orm/sequelize-wrapper';
import { TestSensor, TestSensorNoTelemetry } from '../../../testing-plugin';

describe('lib/sensors', () => {
  let sensorService: SensorService;

  let sensorStubInstance: StubbedInstance<TestSensor>;
  let validatorStubInstance: StubbedInstance<SensorValidator>;
  let repositoryStub: StubbedInstance<SensorRepository>;
  let telemetryRepository: StubbedInstance<TelemetryRepository>;

  beforeEach(() => {
    const sequelizeWrapperStub = stubConstructor(SequelizeWrapper, {
      dialect: 'sqlite',
      storage: '',
    });

    repositoryStub = stubConstructor(SensorRepository, sequelizeWrapperStub);
    validatorStubInstance = stubConstructor(SensorValidator);

    repositoryStub.createSensor.resolves();

    validatorStubInstance.validateAsync.resolves(new ValidationResult());

    sensorStubInstance = stubConstructor(TestSensor);
    const sensorStubInstance2 = stubConstructor(TestSensorNoTelemetry);

    sensorStubInstance.validate.resolves(true);

    telemetryRepository = stubConstructor(
      TelemetryRepository,
      sequelizeWrapperStub,
    );
    telemetryRepository.saveTelemetryData.resolves();

    sensorService = new SensorService(
      repositoryStub,
      validatorStubInstance,
      telemetryRepository,
      [sensorStubInstance, sensorStubInstance2],
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('processSensorReadings', async () => {
    it('should save telemetry if the setting is true', async () => {
      repositoryStub.getAllSensors.resolves([
        {
          type_id: 'testing-sensor',
          name: 'testing',
          config: {},
        },
      ]);

      await sensorService.processSensorReadings();

      expect(telemetryRepository.saveTelemetryData.callCount).to.eq(1);
    });

    it('should not save telemetry if the setting is false', async () => {
      repositoryStub.getAllSensors.resolves([
        {
          type_id: 'testing-sensor-no-telem',
          name: 'testing',
          config: {},
        },
      ]);

      await sensorService.processSensorReadings();

      expect(telemetryRepository.saveTelemetryData.callCount).to.eq(0);
    });
  });

  describe('createSensor', () => {
    it('should throw an error when the sensor type validation fails', async () => {
      sensorStubInstance.validate.reset();
      sensorStubInstance.validate.resolves(false);

      try {
        await sensorService.createSensor({
          type_id: 'testing-sensor',
          config: {},
          name: 'test-sensor',
        });
        expect.fail('should have errored');
      } catch (err) {
        expect(err.errorCode).to.eq('CONFIG_INVALID');
      }
    });

    it('should throw an error if the validation is invalid', async () => {
      validatorStubInstance.validateAsync.reset();

      const validationFailure = new ValidationFailure(
        '',
        '',
        '',
        'TEST_ERROR',
        '',
        Severity.ERROR,
      );

      const validationResult = new ValidationResult();
      validationResult.addFailures([validationFailure]);

      validatorStubInstance.validateAsync.resolves(validationResult);

      try {
        await sensorService.createSensor({
          type_id: 'testing-sensor',
          config: {},
          name: 'test-sensor',
        });
        expect.fail('should have errored');
      } catch (err) {
        expect(err.errorCode).to.eq('TEST_ERROR');
      }
    });
  });
});

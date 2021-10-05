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
import { SequelizeWrapper } from '../../../../src/orm/sequelize-wrapper';
import { TestSensor } from '../../../testing-plugin';

describe('lib/sensors', () => {
  let sensorService: SensorService;

  let sensorStubInstance: StubbedInstance<TestSensor>;
  let validatorStubInstance: StubbedInstance<SensorValidator>;
  let repositoryStub: StubbedInstance<SensorRepository>;

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

    sensorStubInstance.validate.resolves(true);

    sensorService = new SensorService(repositoryStub, validatorStubInstance, [
      sensorStubInstance,
    ]);
  });

  afterEach(() => {
    sinon.restore();
  });

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

import { expect } from 'chai';
import {
  Severity,
  ValidationFailure,
  ValidationResult,
} from 'fluent-ts-validator';
import * as sinon from 'sinon';
import { StubbedInstance, stubConstructor } from 'ts-sinon';
import { PeripheralService } from '../../../../src/lib/peripherals';
import { PeripheralsRepository } from '../../../../src/lib/peripherals/repository';
import { PeripheralsValidator } from '../../../../src/lib/peripherals/validation';
import { TestingActor } from '../../../test-data/actor-types';
import { sequelizeWrapperStub } from '../shared-stubs/sequelize-wrapper';

describe('lib/peripherals', () => {
  let peripheralService: PeripheralService;

  let peripheralStubInstance: StubbedInstance<TestingActor>;
  let validatorStubInstance: StubbedInstance<PeripheralsValidator>;
  let repositoryStub: StubbedInstance<PeripheralsRepository>;

  beforeEach(() => {
    repositoryStub = stubConstructor(
      PeripheralsRepository,
      sequelizeWrapperStub,
    );
    repositoryStub.createPeripheral.resolves();

    validatorStubInstance = stubConstructor(PeripheralsValidator);
    validatorStubInstance.validateAsync.resolves(new ValidationResult());

    peripheralStubInstance = stubConstructor(TestingActor);
    peripheralStubInstance.validate.resolves(true);

    peripheralService = new PeripheralService(
      [peripheralStubInstance],
      validatorStubInstance,
      repositoryStub,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should throw an error when the sensor type validation fails', async () => {
    peripheralStubInstance.validate.reset();
    peripheralStubInstance.validate.resolves(false);

    try {
      await peripheralService.createPeripheral({
        type_id: 'testing-actor',
        config: {},
        name: 'test-actor',
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
      await peripheralService.createPeripheral({
        type_id: 'testing-actor',
        config: {},
        name: 'test-actor',
      });
      expect.fail('should have errored');
    } catch (err) {
      expect(err.errorCode).to.eq('TEST_ERROR');
    }
  });
});

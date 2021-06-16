import * as sinon from 'sinon';
import { expect } from 'chai';

import { createHeaterValidator } from '../../../../app/lib/peripherals/validation';
import { ValidationResult } from 'fluent-ts-validator';

import * as Repository from '../../../../app/lib/peripherals/repository';
import { createHeater } from '../../../../app/lib/peripherals/heaters';

describe('lib/peripherals/heaters', () => {
  let createHeaterValidatorStub: sinon.SinonStub;
  let createPeripheralStub: sinon.SinonStub;

  beforeEach(() => {
    createHeaterValidatorStub = sinon
      .stub(createHeaterValidator, 'validateAsync')
      .resolves(new ValidationResult());

    createPeripheralStub = sinon
      .stub(Repository, 'createPeripheral')
      .resolves('id');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call to save the peripheral if the object validates', async () => {
    await createHeater({ communicationType: 'gpio', gpio: 1, name: 'test' });
    expect(createPeripheralStub.callCount).to.eq(1);
  });
  it('should not call the repository if the peripheral fails to validate', async () => {
    createHeaterValidatorStub.reset();

    const validationResult = new ValidationResult();
    validationResult.addFailures([
      {
        attemptedValue: undefined,
        code: 'code',
        message: 'message',
        propertyName: 'propertyName',
        severity: 'severity',
        target: 'target',
      },
    ]);

    createHeaterValidatorStub.resolves(validationResult);

    try {
      await createHeater({ communicationType: 'gpio', gpio: 1, name: 'test' });
      expect.fail('we expected an error to be thrown');
    } catch (err) {
      expect(createPeripheralStub.callCount).to.eq(0);
    }
  });
});

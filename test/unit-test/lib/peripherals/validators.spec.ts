import { expect } from 'chai';
import { ValidationFailure } from 'fluent-ts-validator';
import { createHeaterValidator } from '../../../../app/lib/peripherals/validation';

describe('lib/peripherals/validation', () => {
  describe('CreateHeaterValidator', () => {
    it('should return an error related to name if the name is undefined', async () => {
      const response = await createHeaterValidator.validateAsync({
        name: undefined,
        communicationType: 'gpio',
        gpio: 1,
      });

      expect(response.isValid()).to.be.false;
      await shouldHaveFailureRelatedTo('name', response.getFailures());
    });

    it('should return an error related to name if the name is not alpha numeric', async () => {
      const response = await createHeaterValidator.validateAsync({
        name: '$@£@*)asdasd',
        communicationType: 'gpio',
        gpio: 1,
      });

      expect(response.isValid()).to.be.false;
      await shouldHaveFailureRelatedTo('name', response.getFailures());
    });

    it('should return an error related to communicationType if it does not match a valid value', async () => {
      const response = await createHeaterValidator.validateAsync({
        name: 'name',
        communicationType: 'test',
        gpio: 1,
      });

      expect(response.isValid()).to.be.false;
      await shouldHaveFailureRelatedTo(
        'communicationType',
        response.getFailures(),
      );
    });

    it('should return an error related to gpio if it is less than 0 and the communicationType is gpio', async () => {
      const response = await createHeaterValidator.validateAsync({
        name: 'name',
        communicationType: 'gpio',
        gpio: -1,
      });

      expect(response.isValid()).to.be.false;
      await shouldHaveFailureRelatedTo('gpio', response.getFailures());
    });

    it('should return an error related to gpio if it is less than 20 and the communicationType is gpio', async () => {
      const response = await createHeaterValidator.validateAsync({
        name: 'name',
        communicationType: 'gpio',
        gpio: 30,
      });

      expect(response.isValid()).to.be.false;
      await shouldHaveFailureRelatedTo('gpio', response.getFailures());
    });
  });

  async function shouldHaveFailureRelatedTo(
    fieldName: string,
    failures: ValidationFailure[],
  ) {
    const failuresForField = failures.filter(
      (f) => f.propertyName === fieldName,
    );

    expect(failuresForField.length).to.be.greaterThan(0);
  }
});

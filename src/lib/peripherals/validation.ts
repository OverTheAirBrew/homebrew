import { AbstractValidator } from 'fluent-ts-validator';
import { Service } from 'typedi';
import { Peripheral } from '../models/peripheral';

@Service()
export class PeripheralsValidator extends AbstractValidator<Peripheral> {
  constructor() {
    super();

    this.validateIfString((x) => x.name)
      .isDefined()
      .isAlphanumeric()
      .withFailureCode('NAME_INVALID');

    this.validateIfString((x) => x.communicationType)
      .isIn(['gpio'])
      .withFailureCode('COMMUNICATION_TYPE_IS_INVALID');

    this.validateIfAny((x) => x.config)
      .isDefined()
      .fulfills(new GpioConfigValidator())
      .when((x) => x.communicationType === 'gpio')
      .withFailureCode('GPIO_NUMBER_IS_NOT_IN_RANGE');
  }
}

class GpioConfigValidator extends AbstractValidator<{ gpio: number }> {
  constructor() {
    super();

    this.validateIfNumber((x) => x.gpio)
      .isDefined()
      .isLessThan(20)
      .isGreaterThan(0)
      .withFailureCode('GPIO_NUMBER_IS_NOT_IN_RANGE');
  }
}

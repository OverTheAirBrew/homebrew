import { AbstractValidator } from 'fluent-ts-validator';
import { Service } from 'typedi';
import { IHeater } from './models';

@Service()
export class CreateHeaterValidator extends AbstractValidator<IHeater> {
  constructor() {
    super();

    this.validateIfString((x) => x.name)
      .isDefined()
      .isAlphanumeric()
      .withFailureCode('NAME_INVALID');

    this.validateIfString((x) => x.communicationType)
      .isIn(['gpio'])
      .withFailureCode('COMMUNICATION_TYPE_IS_INVALID');

    this.validateIfNumber((x) => x.gpio)
      .isDefined()
      .isLessThan(20)
      .isGreaterThan(0)
      .when((x) => x.communicationType === 'gpio')
      .withFailureCode('GPIO_NUMBER_IS_NOT_IN_RANGE');
  }
}

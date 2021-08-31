import { AbstractValidator } from 'fluent-ts-validator';
import { Service } from 'typedi';
import { Peripheral } from '../models/peripheral';

@Service()
export class PeripheralsValidator extends AbstractValidator<Peripheral> {
  constructor() {
    super();
  }
}

// class GpioConfigValidator extends AbstractValidator<{ gpio: number }> {
//   constructor() {
//     super();

//     this.validateIfNumber((x) => x.gpio)
//       .isDefined()
//       .isLessThan(20)
//       .isGreaterThan(0)
//       .withFailureCode('GPIO_NUMBER_IS_NOT_IN_RANGE');
//   }
// }

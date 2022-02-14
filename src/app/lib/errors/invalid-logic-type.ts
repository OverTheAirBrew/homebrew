import { BaseError } from './base-error';

export class InvalidLogicTypeError extends BaseError {
  constructor(logicTypeId: string) {
    super(
      400,
      'INVALID_LOGIC_TYPE',
      'InvalidLogicTypeError',
      `Logic type with id ${logicTypeId} does not exist`,
    );
  }
}

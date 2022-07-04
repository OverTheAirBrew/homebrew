import { BaseError } from './base-error';

export class InvalidLogicTypeError extends BaseError {
  constructor(logicType_id: string) {
    super(
      400,
      'INVALID_LOGIC_TYPE',
      'InvalidLogicTypeError',
      `Invalid logic type id: ${logicType_id}`,
    );
  }
}

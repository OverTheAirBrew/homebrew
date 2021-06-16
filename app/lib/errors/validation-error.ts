import { ValidationResult } from 'fluent-ts-validator';
import { BaseError } from './ota-base-error';

export class ValidationError extends BaseError {
  constructor(failure: ValidationResult) {
    const failures = failure.getFailures();

    super(failures[0].message, {
      httpCode: 400,
      errorCode: failures[0].code || 'UNKNOWN ERROR',
    });
  }
}

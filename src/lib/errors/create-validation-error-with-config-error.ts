import { ValidationError } from './validation-error';
import { ValidationFailure, ValidationResult } from 'fluent-ts-validator';

export async function createValidationErrorWithConfigError(
  failures: ValidationFailure[],
  configValid: boolean,
  config: any,
): Promise<ValidationError> {
  const validationResult = new ValidationResult();
  validationResult.addFailures(failures);

  if (!configValid) {
    validationResult.addFailures([
      new ValidationFailure('', 'config', config, 'CONFIG_INVALID'),
    ]);
  }

  return new ValidationError(validationResult);
}

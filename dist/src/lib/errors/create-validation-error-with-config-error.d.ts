import { ValidationFailure } from 'fluent-ts-validator';
import { ValidationError } from './validation-error';
export declare function createValidationErrorWithConfigError(failures: ValidationFailure[], configValid: boolean, config: any): Promise<ValidationError>;

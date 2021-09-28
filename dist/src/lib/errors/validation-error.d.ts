import { ValidationFailure, ValidationResult } from 'fluent-ts-validator';
import { BaseError } from './ota-base-error';
export declare class ValidationError extends BaseError {
    failures: ValidationFailure[];
    constructor(failure: ValidationResult);
}

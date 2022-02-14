import { ValidationErrors } from 'fluentvalidation-ts/dist/ValidationErrors';

export class ValidationError extends Error {
  name = 'ValidationError';
  httpCode: number = 400;
  code = 'VALIDATION_ERROR';

  constructor(public failures: ValidationErrors<any>) {
    super(`One or more validation errors occurred`);
  }
}

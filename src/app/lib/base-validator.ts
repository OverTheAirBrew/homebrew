import { AsyncValidator } from 'fluentvalidation-ts';

export class BaseValidator<T> extends AsyncValidator<T> {
  public async isValid(errors: Record<string, any>): Promise<boolean> {
    const isValid = Object.keys(errors).length === 0;
    return isValid;
  }
}

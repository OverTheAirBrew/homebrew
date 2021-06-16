import { BaseError } from './ota-base-error';

export class PeripheralNotFoundError extends BaseError {
  constructor(type: string, id: string) {
    super(`A ${type} cannot be found with id ${id}`, {
      httpCode: 404,
      errorCode: 'PERIPHERAL_NOT_FOUND',
    });
  }
}

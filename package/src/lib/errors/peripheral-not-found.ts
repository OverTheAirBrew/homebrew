import { BaseError } from './ota-base-error';

export class PeripheralNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Peripheral with id ${id} not found`, {
      httpCode: 404,
      errorCode: 'PERIPHERAL_NOT_FOUND',
    });
  }
}

import { BaseError } from './ota-base-error';

export class PeripheralImplementationNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Peripheral implementation with type ${id} not found`, {
      httpCode: 404,
      errorCode: 'PERIPHERAL_IMPLEMENTATION_NOT_FOUND',
    });
  }
}

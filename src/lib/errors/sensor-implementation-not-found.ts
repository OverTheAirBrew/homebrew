import { BaseError } from './ota-base-error';

export class SensorImplementationNotFoundError extends BaseError {
  constructor(id: string) {
    super(`Sensor implementation with type ${id} not found`, {
      httpCode: 404,
      errorCode: 'SENSOR_IMPLEMENTATION_NOT_FOUND',
    });
  }
}

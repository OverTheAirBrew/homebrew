import { BaseError } from './base-error';

export class SensorDoesNotExistError extends BaseError {
  constructor(sensor_id: string) {
    super(
      404,
      'SENSOR_DOES_NOT_EXIST',
      'SensorDoesNotExistError',
      `Sensor with id ${sensor_id} does not exist`,
    );
  }
}

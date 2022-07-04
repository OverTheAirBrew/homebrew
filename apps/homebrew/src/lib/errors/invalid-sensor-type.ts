import { BaseError } from './base-error';

export class InvalidSensorTypeError extends BaseError {
  constructor(sensorType_id: string) {
    super(
      400,
      'INVALID_SENSOR_TYPE',
      'InvalidSensorTypeError',
      `Invalid sensor type id: ${sensorType_id}`,
    );
  }
}

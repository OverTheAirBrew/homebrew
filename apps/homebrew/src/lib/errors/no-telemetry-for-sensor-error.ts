import { BaseError } from './base-error';

export class NoTelemetryForSensorError extends BaseError {
  constructor(sensor_id: string) {
    super(
      400,
      'NO_TELEMETRY_FOR_SENSOR',
      'NoTelemetryForSensorError',
      `No telemetry for sensor ${sensor_id}`,
    );
  }
}

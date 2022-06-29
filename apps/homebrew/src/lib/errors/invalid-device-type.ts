import { BaseError } from './base-error';

export class InvalidDeviceTypeError extends BaseError {
  constructor(deviceType_id: string) {
    super(
      400,
      'INVALID_DEVICE_TYPE',
      'InvalidDeviceTypeError',
      `Invalid device type id: ${deviceType_id}`,
    );
  }
}

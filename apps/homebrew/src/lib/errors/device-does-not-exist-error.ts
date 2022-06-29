import { BaseError } from './base-error';

export class DeviceDoesNotExistError extends BaseError {
  constructor(device_id: string) {
    super(
      404,
      'DEVICE_DOES_NOT_EXIST',
      'DeviceDoesNotExistError',
      `Device with id ${device_id} does not exist`,
    );
  }
}

import { BaseError } from './base-error';

export class KettleNotFoundError extends BaseError {
  constructor(kettle_id: string) {
    super(
      404,
      'KETTLE_NOT_FOUND',
      'KettleNotFoundError',
      `Kettle with id ${kettle_id} does not exist`,
    );
  }
}

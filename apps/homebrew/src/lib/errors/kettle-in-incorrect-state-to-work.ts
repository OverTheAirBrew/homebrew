import { BaseError } from './base-error';

export class KettleInIncorrectStateToWork extends BaseError {
  constructor(kettle_id: string) {
    super(
      400,
      'KETTLE_IN_INCORRECT_STATE_TO_WORK',
      'KettleInIncorrectStateToWork',
      `Kettle ${kettle_id} is in the incorrect state to work.`,
    );
  }
}

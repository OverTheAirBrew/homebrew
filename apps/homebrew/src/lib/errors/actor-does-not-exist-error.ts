import { BaseError } from './base-error';

export class ActorDoesNotExistError extends BaseError {
  constructor(actor_id: string) {
    super(
      404,
      'ACTOR_DOES_NOT_EXIST',
      'ActorDoesNotExistError',
      `Actor with id ${actor_id} does not exist`,
    );
  }
}

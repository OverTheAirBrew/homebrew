import { BaseError } from './base-error';

export class InvalidActorTypeError extends BaseError {
  constructor(actorType_id: string) {
    super(
      400,
      'INVALID_ACTOR_TYPE',
      'InvalidActorTypeError',
      `Invalid actor type id: ${actorType_id}`,
    );
  }
}

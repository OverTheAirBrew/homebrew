import { ValidationError } from '../errors/validation-error';
import { IHeater } from './models';
import { createHeaterValidator } from './validation';

import * as Repository from './repository';

export async function createHeater(request: IHeater) {
  const validationResult = await createHeaterValidator.validateAsync(request);

  if (validationResult.isValid()) {
    const id = await Repository.createPeripheral({
      communicationType: request.communicationType,
      name: request.name,
      type: 'heater',
      gpio: request.gpio,
    });

    return id;
  }

  throw new ValidationError(validationResult);
}

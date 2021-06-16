import { ValidationError } from '../errors/validation-error';
import { IHeater } from './models';
import { createHeaterValidator } from './validation';

import * as Repository from './repository';
import { IPeripheral } from '../../orm/models/peripherals';

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

export async function getHeaters() {
  const heaters = await Repository.getPeripheralsOfType('heater');
  return await Promise.all(heaters.map(mapHeater));
}

export async function getHeaterById(id: string) {
  const heater = await Repository.getPeripheralByTypeAndId('heater', id);
  return await mapHeater(heater);
}

async function mapHeater(heater: IPeripheral) {
  return {
    id: heater.id,
    name: heater.name,
    type: heater.type.toString(),
    communicationType: heater.communicationType.toString(),
    gpio: heater.gpio,
  };
}

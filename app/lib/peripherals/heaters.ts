import { ValidationError } from '../errors/validation-error';
import { IHeater } from './models';
import { CreateHeaterValidator } from './validation';

import { PeripheralsRepository } from './repository';
import { IPeripheral } from '../../orm/models/peripherals';
import { Service } from 'typedi';

@Service()
export class HeaterService {
  constructor(
    private validator: CreateHeaterValidator,
    private repository: PeripheralsRepository,
  ) {}

  public async createHeater(request: IHeater) {
    const validationResult = await this.validator.validateAsync(request);

    if (validationResult.isValid()) {
      const id = await this.repository.createPeripheral({
        communicationType: request.communicationType,
        name: request.name,
        type: 'heater',
        gpio: request.gpio,
      });

      return id;
    }

    throw new ValidationError(validationResult);
  }

  public async getHeaters() {
    const heaters = await this.repository.getPeripheralsOfType('heater');
    return await Promise.all(heaters.map(this.mapHeater));
  }

  public async getHeaterById(id: string) {
    const heater = await this.repository.getPeripheralByTypeAndId('heater', id);
    return await this.mapHeater(heater);
  }

  private async mapHeater(heater: IPeripheral) {
    return {
      id: heater.id,
      name: heater.name,
      type: heater.type.toString(),
      communicationType: heater.communicationType.toString(),
      gpio: heater.gpio,
    };
  }
}

import { ValidationError } from '../errors/validation-error';
import {
  Peripheral,
  PeripheralDto,
  PeripheralType,
} from '../models/peripheral';
import { PeripheralsValidator } from './validation';

import { PeripheralsRepository } from './repository';
import { IPeripheral } from '../../orm/models/peripherals';
import { Service } from 'typedi';

@Service()
export class PeripheralService {
  constructor(
    private validator: PeripheralsValidator,
    private repository: PeripheralsRepository,
  ) {}

  public async createPeripheral(request: Peripheral) {
    const validationResult = await this.validator.validateAsync(request);

    if (validationResult.isValid()) {
      const id = await this.repository.createPeripheral({
        communicationType: request.communicationType,
        name: request.name,
        type: request.type,
        gpio: request.gpio,
      });

      return id;
    }

    throw new ValidationError(validationResult);
  }

  public async getPeripherals() {
    const heaters = await this.repository.getPeripherals();
    return await Promise.all(heaters.map(this.mapPeripheral));
  }

  public async getPeripheralById(id: string) {
    const heater = await this.repository.getPeripheralByTypeAndId(id);
    return await this.mapPeripheral(heater);
  }

  private async mapPeripheral(peripheral: IPeripheral): Promise<PeripheralDto> {
    return new PeripheralDto(
      peripheral.id,
      peripheral.name,
      peripheral.type.toString(),
      peripheral.communicationType.toString(),
      peripheral.gpio,
    );
  }
}

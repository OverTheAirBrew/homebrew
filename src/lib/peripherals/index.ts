import {
  Actor as ActorType,
  ActorToken,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { IPeripheral } from '../../orm/models/peripheral';
import { createValidationErrorWithConfigError } from '../errors/create-validation-error-with-config-error';
import { Peripheral, PeripheralDto } from '../models/peripheral';
import { PeripheralsRepository } from './repository';
import { PeripheralsValidator } from './validation';

@Service()
export class PeripheralService {
  constructor(
    @InjectMany(ActorToken) private actors: ActorType[],
    private validator: PeripheralsValidator,
    private repository: PeripheralsRepository,
  ) {}

  private async getPeripheralImplementation(type_id: string) {
    const implementation = this.actors.find((a) => a.actorName === type_id);
    return implementation;
  }

  public async createPeripheral(peripheral: Peripheral) {
    const peripheralImplementation = await this.getPeripheralImplementation(
      peripheral.type_id,
    );

    const validationResult = await this.validator.validateAsync(peripheral);
    const configValid = await peripheralImplementation.validate(
      peripheral.config,
    );

    if (validationResult.isValid() && configValid) {
      const id = await this.repository.createPeripheral(
        peripheral.name,
        peripheral.type_id,
        peripheral.config,
      );

      return id;
    }

    const error = await createValidationErrorWithConfigError(
      validationResult.getFailures(),
      configValid,
      peripheral.config,
    );

    throw error;
  }

  public async getPeripherals() {
    const peripherals = await this.repository.getPeripherals();
    return await Promise.all(peripherals.map(this.mapPeripheral));
  }

  public async getPeripheralById(peripheral_id: string) {
    const peripheral = await this.repository.getPeripheral(peripheral_id);
    return await this.mapPeripheral(peripheral);
  }

  private async mapPeripheral(peripheral: IPeripheral): Promise<PeripheralDto> {
    return {
      id: peripheral.id,
      name: peripheral.name,
      type_id: peripheral.type_id,
      config: peripheral.config,
    };
  }
}

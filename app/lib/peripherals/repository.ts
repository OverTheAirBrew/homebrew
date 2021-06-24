import { Service } from 'typedi';
import Peripheral, {
  PeripheralCommunicationType,
  PeripheralType,
} from '../../orm/models/peripherals';
import { PeripheralNotFoundError } from '../errors/peripheral-not-found';

import { BaseRepository } from '../base-repository';

@Service()
export class PeripheralsRepository extends BaseRepository<Peripheral> {
  constructor() {
    super(Peripheral);
  }

  public async createPeripheral(peripheral: {
    name: string;
    type: string;
    communicationType: string;
    gpio?: number;
  }) {
    const createdPeripheral = await this.model.create({
      ...peripheral,
      communicationType:
        peripheral.communicationType as PeripheralCommunicationType,
      type: peripheral.type as PeripheralType,
    });
    return createdPeripheral.id;
  }

  public async getPeripheralsOfType(type: PeripheralType) {
    const peripherals = await this.model.findAll({
      where: {
        type,
      },
    });

    return peripherals.map((peripheral) => peripheral.toJSON());
  }

  public async getPeripheralByTypeAndId(type: PeripheralType, id: string) {
    const peripheral = await this.model.findOne({
      where: {
        type,
        id,
      },
    });

    if (!peripheral) {
      throw new PeripheralNotFoundError(type, id);
    }

    return peripheral.toJSON();
  }
}

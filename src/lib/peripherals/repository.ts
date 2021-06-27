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

  public async getPeripherals() {
    const peripherals = await this.model.findAll({});
    return peripherals.map((peripheral) => peripheral.toJSON());
  }

  public async getPeripheralByTypeAndId(id: string) {
    const peripheral = await this.model.findOne({
      where: {
        id,
      },
    });

    if (!peripheral) {
      throw new PeripheralNotFoundError(id);
    }

    return peripheral.toJSON();
  }
}

import { Service } from 'typedi';
import Peripheral from '../../orm/models/peripheral';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';

@Service()
export class PeripheralsRepository extends BaseRepository<Peripheral> {
  constructor(wrapper: SequelizeWrapper) {
    super(Peripheral, wrapper.sequelize);
  }

  public async createPeripheral(name: string, type_id: string, config: {}) {
    const peripheral = await this.model.create({
      name,
      type_id,
      config,
    });

    return peripheral.id;
  }

  public async getPeripherals() {
    const peripherals = await this.model.findAll({ where: {} });
    return peripherals.map((peripheral) => peripheral.toJSON());
  }

  public async getPeripheral(peripheral_id: string) {
    const peripheral = await this.model.findByPk(peripheral_id);
    return peripheral.toJSON();
  }
}

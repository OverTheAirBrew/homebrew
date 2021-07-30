import { Service } from 'typedi';
import Sensor from '../../orm/models/sensor';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';

@Service()
export class SensorRepository extends BaseRepository<Sensor> {
  constructor(wrapper: SequelizeWrapper) {
    super(Sensor, wrapper.sequelize);
  }

  public async getSensors() {
    const sensors = await this.model.findAll({});
    return sensors.map((sensor) => sensor.toJSON());
  }
}

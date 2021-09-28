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
    const sensors = await this.model.findAll({
      where: {},
    });
    return sensors.map((sensor) => sensor.toJSON());
  }

  public async createSensor(
    name: string,
    type_id: string,
    config: { sensorAddress: string },
  ) {
    const sensor = await this.model.create({
      name,
      type_id,
      config,
    });

    return sensor.id;
  }
}

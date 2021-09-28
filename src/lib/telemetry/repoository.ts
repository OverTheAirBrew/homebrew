import { Service } from 'typedi';
import Telemetry from '../../orm/models/telemetry';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../base-repository';

@Service()
export class TelemetryRepository extends BaseRepository<Telemetry> {
  constructor(wrapper: SequelizeWrapper) {
    super(Telemetry, wrapper.sequelize);
  }

  public async addTelemetryRecord(sensor_id: string, reading: number) {
    await this.model.create({
      sensor_id,
      reading,
    });
  }
}

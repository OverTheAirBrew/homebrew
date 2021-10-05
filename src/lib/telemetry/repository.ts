import { Inject, Service } from 'typedi';
import Telemetry from '../../orm/models/telemetry';
import { SequelizeWrapper } from '../../orm/sequelize-wrapper';
import { BaseRepository } from '../utils/base-repository';

@Service()
export class TelemetryRepository extends BaseRepository<Telemetry> {
  constructor(@Inject() sequelizeWrapper: SequelizeWrapper) {
    super(Telemetry, sequelizeWrapper.sequelize);
  }

  public async saveTelemetryData(sensor_id: string, value: number) {
    await this.model.create({
      reading: value,
      sensor_id,
    });
  }
}

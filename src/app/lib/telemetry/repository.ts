import { Service } from 'typedi';
import { EntityRepository, Repository } from 'typeorm';
import { Telemetry } from '../../orm/models/telemetry';

@Service()
@EntityRepository(Telemetry)
export class TelemetryRepository extends Repository<Telemetry> {
  async saveTelemetryForSensorId(sensor_id: string, value: number) {
    await this.insert({
      sensor_id,
      value,
    });
  }
}

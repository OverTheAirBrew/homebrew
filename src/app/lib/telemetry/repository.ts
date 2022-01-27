import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Telemetry } from '../../orm/models/telemetry';

@Service()
export class TelemetryRepository {
  constructor(
    @InjectRepository(Telemetry) private connection: Repository<Telemetry>,
  ) {}

  async saveTelemetryForSensorId(sensor_id: string, value: number) {
    await this.connection.insert({
      sensor_id,
      value,
    });
  }
}

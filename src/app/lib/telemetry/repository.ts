import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Sensor } from '../../orm/models/sensor';
import { Telemetry } from '../../orm/models/telemetry';

@Service()
export class TelemetryRepository {
  constructor(
    @InjectRepository(Telemetry) private connection: Repository<Telemetry>,
  ) {}

  async saveTelemetryForSensorId(sensor: Sensor, value: number) {
    await this.connection.insert({
      sensor,
      value,
    });
  }
}

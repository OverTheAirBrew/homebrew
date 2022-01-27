import { Service } from 'typedi';
import { TelemetryRepository } from './repository';

@Service()
export class TelementryService {
  constructor(private telementryRepository: TelemetryRepository) {}

  async saveTelemetryForSensorId(sensor_id: string, value: number) {
    if (!value) return;

    await this.telementryRepository.saveTelemetryForSensorId(sensor_id, value);
  }
}

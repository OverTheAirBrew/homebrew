import { Inject, Service } from 'typedi';
import { TelemetryRepository } from './repository';

@Service()
export class TelemetryService {
  constructor(@Inject() private telemetryRepository: TelemetryRepository) {}

  public async saveSensorReading(sensor_id: string, reading: number) {
    await this.telemetryRepository.saveTelemetryData(sensor_id, reading);
  }
}

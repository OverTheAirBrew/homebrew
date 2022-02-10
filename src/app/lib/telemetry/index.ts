import { Service } from 'typedi';
import { SensorRepository } from '../sensor/repository';
import { TelemetryRepository } from './repository';

@Service()
export class TelemetryService {
  constructor(
    private telementryRepository: TelemetryRepository,
    private sensorRepository: SensorRepository,
  ) {}

  async saveTelemetryForSensorId(sensor_id: string, value: number) {
    if (!value) return;

    const sensor = await this.sensorRepository.getSensorById(sensor_id);

    await this.telementryRepository.saveTelemetryForSensorId(sensor, value);
  }
}

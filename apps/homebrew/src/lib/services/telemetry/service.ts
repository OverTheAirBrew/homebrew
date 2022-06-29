import { Inject, Injectable } from '@nestjs/common';
import { Telemetry } from '../../../database/models/telemetry';
import { TelemetryRepository } from '../../constants';
import { NoTelemetryForSensorError } from '../../errors/no-telemetry-for-sensor-error';

@Injectable()
export class TelemetryService {
  constructor(
    @Inject(TelemetryRepository) private repository: typeof Telemetry,
  ) {}

  public async createTelemetry(sensor_id: string, reading: number) {
    await this.repository.create({
      sensor_id,
      reading,
    });
  }

  public async getLatestValue(sensor_id: string) {
    const telemetry = await this.repository.findOne({
      where: {
        sensor_id,
      },
      order: [['createdAt', 'DESC']],
    });

    if (!telemetry) {
      throw new NoTelemetryForSensorError(sensor_id);
    }

    return telemetry?.reading;
  }
}

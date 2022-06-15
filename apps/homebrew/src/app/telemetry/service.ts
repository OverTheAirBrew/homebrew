import { Inject, Injectable } from '@nestjs/common';
import { Telemetry } from '../../database/models/telemetry';
import { TelemetryRepository } from '../../lib/constants';

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
}
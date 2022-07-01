import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SensorService } from '../../lib/services/sensor/service';

@Injectable()
export class SensorReadingsCronService {
  constructor(private service: SensorService) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async getSensorReadings() {
    await this.service.processSensorReadings();
  }
}

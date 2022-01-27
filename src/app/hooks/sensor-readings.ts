import { Cron, CronController } from 'cron-typedi-decorators';
import { Service } from 'typedi';
import { SensorService } from '../lib/sensor';

@CronController('sensor-reading')
@Service()
export class SensorReadingHook {
  constructor(private sensorService: SensorService) {}

  @Cron('fetch-latest', '*/30 * * * * *')
  async takeSensorReading() {
    await this.sensorService.processLatestSensorReadings();
  }
}

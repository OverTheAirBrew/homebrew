import { Cron, CronController } from 'cron-typedi-decorators';
import { Service } from 'typedi';
import { SensorService } from '../lib/sensors';
import { CronSchedules } from '../lib/utils/cron';

@CronController('sensor-readings')
@Service()
export class SensorReadingHooks {
  constructor(private sensorService: SensorService) {}

  @Cron('sensor-readings', CronSchedules.EVERY_FIVE_SECONDS)
  async testing() {
    await this.sensorService.processSensorReadings();
  }
}

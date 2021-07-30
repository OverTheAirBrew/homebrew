import { CronController, Cron } from 'cron-typedi-decorators';
import { Service } from 'typedi';
import { CronSchedules } from '../lib/cron';
import { SensorService } from '../lib/sensors';

@CronController('sensor-readings')
@Service()
export class SensorReadingHooks {
  constructor(private sensorService: SensorService) {}

  @Cron('sensor-readings', CronSchedules.EVERY_FIVE_SECONDS)
  async testing() {
    await this.sensorService.sendDataForConfiguredSensors();
  }
}

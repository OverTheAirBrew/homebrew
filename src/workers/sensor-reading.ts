import { Cron, CronController } from 'cron-typedi-decorators';
import { Service } from 'typedi';
import { CronSchedules } from '../lib/cron';

@CronController('sensor-readings')
@Service()
export class SensorReadingHooks {
  @Cron('sensor-readings', CronSchedules.EVERY_SECOND)
  testing() {
    console.log('a');
  }
}

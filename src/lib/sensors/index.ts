import { Service } from 'typedi';
import { OneWireFactory } from '@overtheairbrew/raspberrypi-one-wire';
import { SensorFactory } from '../plugins/sensors/factory';

@Service()
export class SensorService {
  constructor(
    private oneWirefactory: OneWireFactory,
    private sensorFactory: SensorFactory,
  ) {}

  public async sendDataForConfiguredSensors() {
    const sensors = await this.oneWirefactory.findDevices();

    for (const sensor of sensors) {
      const sensorImplementation =
        await this.sensorFactory.getSensorImplementation('one-wire', {
          sensorAddress: sensor,
          sensor_id: '1',
        });

      await sensorImplementation.run();
    }

    //here we should look up in the database and only return the ones that are configured

    // return sensors.map((sensor, index) => {
    //   return {
    //     sensorAddress: sensor,
    //     sensorId: `${index}`,
    //   };
    // });
  }
}

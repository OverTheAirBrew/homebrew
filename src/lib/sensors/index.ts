import { Service } from 'typedi';
import { OneWireFactory } from '@overtheairbrew/raspberrypi-one-wire';
import { SensorFactory } from '../plugins/sensors/factory';
import { SensorRepository } from './repository';

@Service()
export class SensorService {
  constructor(
    private oneWirefactory: OneWireFactory,
    private sensorFactory: SensorFactory,
    private sensorRepository: SensorRepository,
  ) {}

  public async sendDataForConfiguredSensors() {
    const physicalSensors = await this.oneWirefactory.findDevices();
    const sensors = await this.sensorRepository.getSensors();

    const sensor_ids = sensors.map((sensor) => sensor.id);

    const existingSensors = sensor_ids.filter((sensor) => {
      return physicalSensors.includes(sensor);
    });

    for (const sensor_id of existingSensors) {
      const sensorObj = sensors.find((sensor) => sensor.id === sensor_id);

      const sensorImplementation =
        await this.sensorFactory.getSensorImplementation(
          sensorObj.type,
          sensorObj.config,
        );

      const value = await sensorImplementation.run();

      // we should replace this with a save to the database?
      console.log(value);
    }
  }
}

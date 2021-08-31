import {
  SensorToken,
  Sensor as SensorType,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { SensorTypeDto } from '../models/sensor-type-dto';

@Service()
export class SensorTypeService {
  constructor(@InjectMany(SensorToken) private sensors: SensorType[]) {}

  public async getSensorTypeIds(): Promise<string[]> {
    const sensorTypes = this.sensors.map((sensor) => sensor.sensorType);
    return sensorTypes;
  }

  public async getSensorTypes(): Promise<SensorTypeDto[]> {
    const sensorTypes = this.sensors.map(
      (sensor) => new SensorTypeDto(sensor.sensorType, sensor.properties),
    );

    return sensorTypes;
  }
}

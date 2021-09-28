import {
  Sensor as SensorType,
  SensorToken,
} from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { SensorTypeDto } from '../models/sensor-type-dto';

@Service()
export class SensorTypeService {
  constructor(
    @InjectMany(SensorToken) private sensors: SensorType[],
    public propMapper: PropertyTypeMapper,
  ) {}

  public async getSensorTypeIds(): Promise<string[]> {
    const sensorTypes = this.sensors.map((sensor) => sensor.sensorType);
    return sensorTypes;
  }

  public async getSensorTypes(): Promise<SensorTypeDto[]> {
    const sensorTypes = await Promise.all(
      this.sensors.map(async (sensor) => {
        const properties = await Promise.all(
          sensor.properties.map(this.propMapper.map),
        );
        return new SensorTypeDto(sensor.sensorType, properties);
      }),
    );

    return sensorTypes;
  }
}

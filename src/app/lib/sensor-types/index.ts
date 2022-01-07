import { Sensor } from '@overtheairbrew/homebrew-plugin';
import { InjectMany, Service } from 'typedi';
import { SensorTypeDto } from '../../models/dto/sensor-types-dto';
import { PropertyMapper } from '../property-mapper';

@Service()
export class SensorTypesService {
  constructor(
    @InjectMany('sensor') private sensors: Sensor[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getSensorTypes() {
    return await Promise.all(
      this.sensors.map((sensor) => this.mapSensorType(sensor)),
    );
  }

  private async mapSensorType(sensor: Sensor) {
    const mappedProperties = await Promise.all(
      sensor.properties.map((p) => this.propertyMapper.map(p)),
    );

    return new SensorTypeDto(sensor.sensorType, mappedProperties);
  }
}

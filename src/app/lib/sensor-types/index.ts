import { InjectMany, Service } from 'typedi';
import { SensorTypeDto } from '../../models/dto/sensor-types-dto';
import { SENSOR_TOKEN } from '../plugin';
import { Sensor as SensorType } from '../plugin/abstractions/sensor';
import { PropertyMapper } from '../property-mapper';

@Service()
export class SensorTypesService {
  constructor(
    @InjectMany(SENSOR_TOKEN) private sensors: SensorType<any>[],
    private propertyMapper: PropertyMapper,
  ) {}

  public async getSensorTypes() {
    return await Promise.all(
      this.sensors.map((sensor) => this.mapSensorType(sensor)),
    );
  }

  public async getRawSensorTypeById(id: string) {
    const sensorType = this.sensors.find((s) => s.sensorName === id);

    if (!sensorType) {
      throw new Error('Invalid sensor type id');
    }

    return sensorType;
  }

  public async getSensorTypeById(id: string) {
    const sensorType = await this.getRawSensorTypeById(id);

    return this.mapSensorType(sensorType);
  }

  public async validateConfig(type_id: string, config: any) {
    const sensorType = await this.getRawSensorTypeById(type_id);
    return await sensorType.validate(config);
  }

  public async getTranslationsForSensor(id: string, locale: string) {
    const sensorType = this.sensors.find((s) => s.sensorName === id);

    if (!sensorType) {
      return {};
    }

    return sensorType.localizations[locale];
  }

  private async mapSensorType(sensor: SensorType<any>) {
    const mappedProperties = await Promise.all(
      sensor.properties.map((p) =>
        this.propertyMapper.map(sensor.sensorName, p),
      ),
    );

    return new SensorTypeDto(sensor.sensorName, mappedProperties);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ISensors } from '../../../lib/constants';
import { InvalidSensorTypeError } from '../../../lib/errors/invalid-sensor-type';
import { ISensor } from '../../../lib/plugin/abstractions/sensor';
import { PropertyMapper } from '../../../lib/property-mapper';
import { SensorTypeDto } from '../../../models/dto/sensor-type.dto';

@Injectable()
export class SensorTypesService {
  constructor(
    @Inject(ISensors) private sensorTypes: ISensor<any>[],
    private mapper: PropertyMapper,
  ) {}

  public async getSensorTypes() {
    return await Promise.all(
      this.sensorTypes.map((sensor) => this.mapSensorType(sensor)),
    );
  }

  public async getRawSensorTypeById(id: string) {
    const sensorType = this.sensorTypes.find((s) => s.name === id);

    if (!sensorType) {
      throw new InvalidSensorTypeError(id);
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

  private async mapSensorType(sensor: ISensor<any>) {
    const mappedProperties = await Promise.all(
      sensor.properties.map((p) => this.mapper.map(sensor.name, p)),
    );

    return new SensorTypeDto(sensor.name, mappedProperties);
  }
}

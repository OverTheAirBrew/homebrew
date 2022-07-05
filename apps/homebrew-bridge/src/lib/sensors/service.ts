import { Inject, Injectable } from '@nestjs/common';
import { ISensor, SelectBoxProperty } from '@ota-internal/shared';
import { ISensors } from '../constants';

@Injectable()
export class SensorService {
  constructor(@Inject(ISensors) private sensors: ISensor<any>[]) {}

  public async getReading(sensorType: string, params: any) {
    const sensor = this.sensors.find((s) => s.name === sensorType);

    if (!sensor) {
      throw new Error(`Sensor ${sensorType} not found`);
    }

    return await sensor.run(undefined, params);
  }

  public async getSensorAddresses(sensorType: string) {
    const sensor = this.sensors.find((s) => s.name === sensorType);

    if (!sensor) {
      throw new Error(`Sensor ${sensorType} not found`);
    }

    return await (
      sensor.properties.find(
        (prop) => prop.id === 'sensorAddress',
      ) as SelectBoxProperty<any>
    ).values();
  }
}

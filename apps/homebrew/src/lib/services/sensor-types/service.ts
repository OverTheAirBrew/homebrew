import { Injectable } from '@nestjs/common';
import { ISensor } from '@ota-internal/shared';
import { SensorTypeDto } from '../../../models/dto/sensor-type.dto';
import { InvalidSensorTypeError } from '../../errors/invalid-sensor-type';
import { PropertyMapper } from '../../property-mapper';
import { DeviceTypesService } from '../device-types/service';

@Injectable()
export class SensorTypesService {
  constructor(
    private deviceTypesService: DeviceTypesService,
    private mapper: PropertyMapper,
  ) {}

  public async getSensorTypes(deviceType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );

    return await Promise.all(device.sensors.map((s) => this.mapSensorType(s)));
  }

  public async getRawSensorTypeById(deviceType: string, sensorType: string) {
    const device = await this.deviceTypesService.getRawDeviceTypeById(
      deviceType,
    );
    const sensor = device.sensors.find((s) => s.name === sensorType);

    if (!sensor) {
      throw new InvalidSensorTypeError(sensorType);
    }

    return sensor;
  }

  public async validateConfig<T>(
    deviceType: string,
    sensorType: string,
    config: T,
  ) {
    const sensor = await this.getRawSensorTypeById(deviceType, sensorType);
    return await sensor.validate(config);
  }

  private async mapSensorType(sensor: ISensor<any>) {
    const mappedProperties = await Promise.all(
      sensor.properties.map((p) => this.mapper.map(sensor.name, p)),
    );

    return new SensorTypeDto(sensor.name, mappedProperties);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { DeviceTypeDto } from '../../../models/dto/device-type.dto';
import { IDevices } from '../../constants';
import { IDevice } from '../../devices/base-device';
import { InvalidDeviceTypeError } from '../../errors/invalid-device-type';
import { PropertyMapper } from '../../property-mapper';

@Injectable()
export class DeviceTypesService {
  constructor(
    @Inject(IDevices) private readonly devices: IDevice<any>[],
    private mapper: PropertyMapper,
  ) {}

  public async getDeviceTypes() {
    return await Promise.all(
      this.devices.map((device) => this.mapDeviceType(device)),
    );
  }

  public async getRawDeviceTypeById(deviceType: string) {
    const device = this.devices.find((d) => d.name === deviceType);

    if (!device) {
      throw new InvalidDeviceTypeError(deviceType);
    }

    return device;
  }

  public async getSensors(deviceType: string) {
    const device = await this.getRawDeviceTypeById(deviceType);
    return device.getSensorTypes();
  }

  public async getActors(deviceType: string) {
    const device = await this.getRawDeviceTypeById(deviceType);
    return device.getActorTypes();
  }

  public async getRawSensorTypeById(deviceType: string, sensor_id: string) {
    const device = await this.getRawDeviceTypeById(deviceType);
    return await device.getRawSensorTypeById(sensor_id);
  }

  public async getRawActorTypeById(deviceType: string, actorType_id: string) {
    const device = await this.getRawDeviceTypeById(deviceType);
    return await device.getRawActorById(actorType_id);
  }

  public async validateSensorConfig<T>(
    device_id: string,
    sensorType_id: string,
    config: T,
  ) {
    const device = this.devices.find((d) => d.name === device_id);
    return await device.validateConfig('sensor', sensorType_id, config);
  }

  public async validateActorConfig<T>(
    device_id: string,
    actorType_id: string,
    config: T,
  ) {
    const device = this.devices.find((d) => d.name === device_id);
    return await device.validateConfig('actor', actorType_id, config);
  }

  private async mapDeviceType(device: IDevice<any>) {
    const mappedProperties = await Promise.all(
      device.properties.map((p) => this.mapper.map(device.name, p)),
    );

    const sensor_ids = (await device.getSensorTypes()).map((s) => s.type);
    const actor_ids = (await device.getActorTypes()).map((a) => a.type);

    return new DeviceTypeDto(
      device.name,
      sensor_ids,
      actor_ids,
      mappedProperties,
    );
  }
}

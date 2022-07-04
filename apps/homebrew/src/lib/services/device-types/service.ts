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

  private async mapDeviceType(device: IDevice<any>) {
    const mappedProperties = await Promise.all(
      device.properties.map((p) => this.mapper.map(device.name, p)),
    );

    return new DeviceTypeDto(device.name, mappedProperties);
  }
}

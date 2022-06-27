import { Inject, Injectable } from '@nestjs/common';
import { Device } from '../../../database/models/device';
import { DeviceDto } from '../../../models/dto/device.dto';
import { DeviceRepository } from '../../constants';
import { DeviceDoesNotExistError } from '../../errors/device-does-not-exist-error';

@Injectable()
export class DeviceService {
  constructor(@Inject(DeviceRepository) private repository: typeof Device) {}

  public async getDeviceById(id: string) {
    const device = await this.repository.findByPk(id);

    if (!device) {
      throw new DeviceDoesNotExistError(id);
    }

    return await this.mapDevice(device);
  }

  public async getAllDevices() {
    const devices = await this.repository.findAll();
    return await Promise.all(devices.map(this.mapDevice));
  }

  private async mapDevice(device: Device) {
    return new DeviceDto(device.id, device.name, device.type_id, device.config);
  }
}

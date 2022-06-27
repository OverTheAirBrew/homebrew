import { Module } from '@nestjs/common';
import { Device, IDevice } from './base-device';
import { LocalDeviceModule } from './local/module';

const allDevices = [LocalDeviceModule];

@Module({
  imports: [...allDevices],
  providers: [
    {
      provide: IDevice,
      useFactory: (devices: Device<any>) => {
        return devices;
      },
      inject: [...allDevices],
    },
  ],
})
export class DeviceModule {}

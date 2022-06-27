import { Module } from '@nestjs/common';
import { IDevices } from '../constants';
import { IDevice } from './base-device';
import { LocalDevice } from './local';
import { LocalDeviceModule } from './local/module';

@Module({
  providers: [
    {
      provide: IDevices,
      useFactory: (...devices: IDevice<any>[]) => {
        return devices;
      },
      inject: [LocalDevice],
    },
  ],
  imports: [LocalDeviceModule],
  exports: [IDevices],
})
export class DeviceModule {}

import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DeviceService } from '../services/device/service';
import { SensorTypesService } from '../services/sensor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidSensorConfig implements ValidatorConstraintInterface {
  constructor(
    private sensorTypesService: SensorTypesService,
    private deviceService: DeviceService,
  ) {}

  public async validate(text: any, args: ValidationArguments) {
    if (!args.object['type_id']) {
      return true;
    }

    try {
      const device = await this.deviceService.getDeviceById(
        args.object['device_id'],
      );

      return await this.sensorTypesService.validateConfig(
        device.type_id,
        args.object['type_id'],
        text,
      );
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Config is not valid for the sensor type`;
  }
}

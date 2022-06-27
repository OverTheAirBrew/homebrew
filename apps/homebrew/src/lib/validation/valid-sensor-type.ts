import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DeviceTypesService } from '../services/device-types/service';
import { DeviceService } from '../services/device/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidSensorType implements ValidatorConstraintInterface {
  constructor(
    private deviceTypesService: DeviceTypesService,
    private deviceService: DeviceService,
  ) {}

  public async validate(text: string, args: ValidationArguments) {
    try {
      const device = await this.deviceService.getDeviceById(
        args.object['device_id'],
      );

      await this.deviceTypesService.getRawSensorTypeById(device.type_id, text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid sensor type`;
  }
}

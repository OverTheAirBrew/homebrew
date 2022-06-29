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
export class ValidSensorType implements ValidatorConstraintInterface {
  constructor(
    private sensorTypesService: SensorTypesService,
    private deviceService: DeviceService,
  ) {}

  public async validate(text: string, args: ValidationArguments) {
    try {
      const device = await this.deviceService.getDeviceById(
        args.object['device_id'],
      );

      await this.sensorTypesService.getRawSensorTypeById(device.type_id, text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid sensor type`;
  }
}

import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DeviceService } from '../services/device/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidDevice implements ValidatorConstraintInterface {
  constructor(private deviceService: DeviceService) {}

  async validate(input: string) {
    try {
      await this.deviceService.getDeviceById(input);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a valid device`;
  }
}

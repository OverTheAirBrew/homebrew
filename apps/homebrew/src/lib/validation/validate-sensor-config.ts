import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SensorTypesService } from '../services/sensor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidSensorConfig implements ValidatorConstraintInterface {
  constructor(private sensorTypesService: SensorTypesService) {}

  public async validate(text: any, args: ValidationArguments) {
    if (!args.object['type_id']) {
      return true;
    }

    try {
      const valid = await this.sensorTypesService.validateConfig(
        args.object['type_id'],
        text,
      );
      return valid;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Config is not valid for the sensor type`;
  }
}

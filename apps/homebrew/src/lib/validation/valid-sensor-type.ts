import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SensorTypesService } from '../services/sensor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidSensorType implements ValidatorConstraintInterface {
  constructor(private sensorTypesService: SensorTypesService) {}

  public async validate(text: string) {
    try {
      await this.sensorTypesService.getRawSensorTypeById(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid sensor type`;
  }
}

import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SensorService } from '../services/sensor/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidSensor implements ValidatorConstraintInterface {
  constructor(private sensorService: SensorService) {}

  async validate(text: string) {
    if (!text) return true;

    try {
      await this.sensorService.getSensorById(text);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a valid sensor`;
  }
}

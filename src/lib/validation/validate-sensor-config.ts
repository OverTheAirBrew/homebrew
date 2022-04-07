import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SensorTypesService } from '../../app/sensor-types/service';
import { SensorDto } from '../../models/dto/sensor.dto';

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
        (args.object as SensorDto).type_id,
        text,
      );
      return valid;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not valid for the sensor type`;
  }
}

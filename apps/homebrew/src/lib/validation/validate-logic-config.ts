import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LogicTypesService } from '../services/logic-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidLogicConfig implements ValidatorConstraintInterface {
  constructor(private logicTypesService: LogicTypesService) {}

  public async validate(text: any, args: ValidationArguments) {
    if (!args.object['logic_id']) {
      return true;
    }

    try {
      const valid = await this.logicTypesService.validateConfig(
        args.object['logic_id'],
        text,
      );
      return valid;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `Config is not valid for the logic type`;
  }
}

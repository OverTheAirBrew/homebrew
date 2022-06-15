import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { LogicTypesService } from '../../app/logic-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidLogicType implements ValidatorConstraintInterface {
  constructor(private logicTypesService: LogicTypesService) {}

  public async validate(text: string, args: ValidationArguments) {
    if (!text) return true;

    try {
      await this.logicTypesService.getRawLogicTypeById(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid logic type`;
  }
}

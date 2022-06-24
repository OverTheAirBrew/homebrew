import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorTypesService } from '../services/actor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActorType implements ValidatorConstraintInterface {
  constructor(private actorTypeService: ActorTypesService) {}

  public async validate(text: string, args: ValidationArguments) {
    try {
      await this.actorTypeService.getRawActorTypeById(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid actor type`;
  }
}

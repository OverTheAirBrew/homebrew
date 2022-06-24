import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorDto } from '../../models/dto/actor.dto';
import { ActorTypesService } from '../services/actor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActorConfig implements ValidatorConstraintInterface {
  constructor(private actorTypeService: ActorTypesService) {}

  public async validate(text: any, args: ValidationArguments) {
    if (!args.object['type_id']) {
      return true;
    }

    try {
      const valid = await this.actorTypeService.validateConfig(
        (args.object as ActorDto).type_id,
        text,
      );
      return valid;
    } catch {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `The config is invalid for the actor type`;
  }
}

import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorTypesService } from '../../app/actor-types/service';
import { ActorDto } from '../../models/dto/actor.dto';

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
    return `${args.property} is not valid for the actor type`;
  }
}

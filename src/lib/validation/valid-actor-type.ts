import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorTypesService } from '../../app/actor-types/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActorType implements ValidatorConstraintInterface {
  constructor(private actorTypeService: ActorTypesService) {}

  public async validate(text: string, args: ValidationArguments) {
    try {
      await this.actorTypeService.getRawActorTypeById(text);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid actor type`;
  }
}

export function IsValidActorType(options?: ValidationOptions) {
  return (o: object, propertyName: string) => {
    registerDecorator({
      target: o.constructor,
      propertyName,
      options,
      validator: ValidActorType,
      async: true,
    });
  };
}

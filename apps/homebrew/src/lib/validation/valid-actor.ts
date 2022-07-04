import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorService } from '../services/actor/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActor implements ValidatorConstraintInterface {
  constructor(private actorService: ActorService) {}

  async validate(text: string) {
    if (!text) return true;

    try {
      await this.actorService.getActorById(text);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} is not a valid actor`;
  }
}

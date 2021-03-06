import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorDto } from '../../models/dto/actor.dto';
import { ActorTypesService } from '../services/actor-types/service';
import { DeviceService } from '../services/device/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActorConfig implements ValidatorConstraintInterface {
  constructor(
    private actorTypeService: ActorTypesService,
    private deviceService: DeviceService,
  ) {}

  public async validate(text: any, args: ValidationArguments) {
    if (!args.object['type_id']) {
      return true;
    }

    try {
      const device = await this.deviceService.getDeviceById(
        args.object['device_id'],
      );

      const valid = await this.actorTypeService.validateConfig(
        device.type_id,
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

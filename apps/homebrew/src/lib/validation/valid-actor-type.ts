import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ActorTypesService } from '../services/actor-types/service';
import { DeviceService } from '../services/device/service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidActorType implements ValidatorConstraintInterface {
  constructor(
    private actorTypesService: ActorTypesService,
    private deviceService: DeviceService,
  ) {}

  public async validate(text: string, args: ValidationArguments) {
    try {
      const device = await this.deviceService.getDeviceById(
        args.object['device_id'],
      );

      await this.actorTypesService.getRawActorTypeById(device.type_id, text);
      return true;
    } catch (err) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} is not a valid actor type`;
  }
}

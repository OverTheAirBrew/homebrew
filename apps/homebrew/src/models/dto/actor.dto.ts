import {
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  Validate,
} from 'class-validator';
import { ValidActorType } from '../../lib/validation/valid-actor-type';
import { ValidDevice } from '../../lib/validation/valid-device';
import { ValidActorConfig } from '../../lib/validation/validate-actor-config';

export class ActorDto {
  constructor(
    id: string,
    name: string,
    device_id: string,
    type_id: string,
    config: any,
  ) {
    this.id = id;
    this.name = name;
    this.device_id = device_id;
    this.type_id = type_id;
    this.config = config;
  }

  id: string;

  @IsString()
  name: string;

  @IsUUID()
  @Validate(ValidDevice)
  device_id: string;

  @IsString()
  @Validate(ValidActorType)
  type_id: string;

  @IsObject()
  @IsNotEmpty({})
  @Validate(ValidActorConfig)
  config: any;
}

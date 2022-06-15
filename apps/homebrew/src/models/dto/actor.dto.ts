import { IsNotEmpty, IsObject, IsString, Validate } from 'class-validator';
import { ValidActorType } from '../../lib/validation/valid-actor-type';
import { ValidActorConfig } from '../../lib/validation/validate-actor-config';

export class ActorDto {
  constructor(id: string, name: string, type_id: string, config: any) {
    this.id = id;
    this.name = name;
    this.type_id = type_id;
    this.config = config;
  }

  id: string;

  @IsString()
  name: string;

  @IsString()
  @Validate(ValidActorType)
  type_id: string;

  @IsObject()
  @IsNotEmpty({})
  @Validate(ValidActorConfig)
  config: any;
}

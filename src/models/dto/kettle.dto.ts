import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString, Validate } from 'class-validator';
import { ValidActor } from '../../lib/validation/valid-actor';
import { ValidLogicType } from '../../lib/validation/valid-logic-type';
import { ValidSensor } from '../../lib/validation/valid-sensor';
import { ValidLogicConfig } from '../../lib/validation/validate-logic-config';

export class KettleDto {
  constructor(
    id: string,
    name: string,
    sensor_id?: string,
    heater_id?: string,
    logicType_id?: string,
    config?: any,
  ) {
    this.id = id;
    this.name = name;
    this.sensor_id = sensor_id;
    this.heater_id = heater_id;
    this.logicType_id = logicType_id;
    this.config = config;
  }

  id: string;

  @IsString()
  name: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidSensor)
  sensor_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidActor)
  heater_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidLogicType)
  logicType_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsObject()
  @Validate(ValidLogicConfig)
  config?: any = undefined;
}

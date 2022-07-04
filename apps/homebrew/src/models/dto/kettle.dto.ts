import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
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
    targetTemperature?: number,
    logicRun_id?: string,
    config?: any,
  ) {
    this.id = id;
    this.name = name;
    this.sensor_id = sensor_id;
    this.heater_id = heater_id;
    this.logicType_id = logicType_id;
    this.logicRun_id = logicRun_id;
    this.targetTemperature = targetTemperature;
    this.config = config;
  }

  id: string;

  @IsString()
  @ApiProperty()
  name: string;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidSensor)
  @ApiPropertyOptional()
  sensor_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidActor)
  @ApiPropertyOptional()
  heater_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsString()
  @Validate(ValidLogicType)
  @ApiPropertyOptional()
  logicType_id?: string = undefined;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsObject()
  @Validate(ValidLogicConfig)
  @ApiPropertyOptional()
  config?: any = undefined;

  @IsNumber()
  @IsOptional()
  targetTemperature?: number = undefined;

  logicRun_id: string;
}

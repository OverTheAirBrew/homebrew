import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, Validate } from 'class-validator';
import { ValidDevice } from '../../lib/validation/valid-device';
import { ValidSensorType } from '../../lib/validation/valid-sensor-type';
import { ValidSensorConfig } from '../../lib/validation/validate-sensor-config';

export class SensorDto {
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
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Validate(ValidDevice)
  @ApiProperty()
  device_id: string;

  @IsString()
  @Validate(ValidSensorType)
  @ApiProperty()
  type_id: string;

  @IsObject()
  @IsNotEmpty()
  @Validate(ValidSensorConfig)
  @ApiProperty()
  config: any;
}

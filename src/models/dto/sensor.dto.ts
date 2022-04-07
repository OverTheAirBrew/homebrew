import { IsNotEmpty, IsObject, IsString, Validate } from 'class-validator';
import { ValidSensorType } from '../../lib/validation/valid-sensor-type';
import { ValidSensorConfig } from '../../lib/validation/validate-sensor-config';

export class SensorDto {
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
  @Validate(ValidSensorType)
  type_id: string;

  @IsObject()
  @IsNotEmpty()
  @Validate(ValidSensorConfig)
  config: any;
}

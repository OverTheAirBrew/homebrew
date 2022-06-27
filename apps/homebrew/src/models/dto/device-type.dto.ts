import { IsArray, IsString } from 'class-validator';
import { PropertyDto } from './property.dto';

export class DeviceTypeDto {
  constructor(
    type: string,
    sensor_ids: string[],
    actor_ids: string[],
    properties: PropertyDto[],
  ) {
    this.type = type;
    this.sensor_ids = sensor_ids;
    this.actor_ids = actor_ids;
    this.properties = properties;
  }

  @IsString() type: string;
  @IsArray() properties: PropertyDto[];

  @IsArray() sensor_ids: string[];
  @IsArray() actor_ids: string[];
}

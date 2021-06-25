import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SensorType {
  'onewire' = 'onewire',
}

export class SensorDto {}

export class Sensor {
  @IsString()
  name: String;

  @IsEnum(SensorType)
  type: SensorType;

  @IsString()
  @IsOptional()
  busAddress: string;
}

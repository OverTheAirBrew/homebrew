import { IsNotEmptyObject, IsObject, IsString } from 'class-validator';

export enum SensorType {
  'onewire' = 'one-wire',
}

export class OneWireConfig {
  busAddress: string;
}

export class Sensor {
  @IsString()
  name: string;

  @IsString()
  type_id: string;

  @IsObject()
  @IsNotEmptyObject()
  config: any;
}

export class SensorDto {
  constructor(id: string, name: string, type_id: string) {
    this.id = id;
    this.name = name;
    this.type_id = type_id;
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type_id: string;
}

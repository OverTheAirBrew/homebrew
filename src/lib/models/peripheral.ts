import {
  IsEnum,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PeripheralType {
  'heater' = 'heater',
  'pump' = 'pump',
}

export enum PeripheralCommunicationType {
  'gpio' = 'gpio',
}

export class GpioConfig {
  constructor(gpio: number) {
    this.gpio = gpio;
  }

  @IsNumber()
  @IsOptional()
  gpio: number;
}

export class PeripheralDto {
  constructor(
    id: string,
    name: string,
    type: string,
    communicationType: string,
    config: GpioConfig,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.communicationType = communicationType;
    this.config = config;
  }

  @IsString()
  id: String;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  communicationType: string;

  @IsObject()
  @IsOptional()
  config: GpioConfig;
}

export class Peripheral {
  @IsString()
  name: string;

  @IsEnum(PeripheralType)
  type: PeripheralType;

  @IsEnum(PeripheralCommunicationType)
  communicationType: string;

  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  config: GpioConfig;
}

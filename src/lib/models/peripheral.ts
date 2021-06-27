import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum PeripheralType {
  'heater' = 'heater',
  'pump' = 'pump',
}

export enum PeripheralCommunicationType {
  'gpio' = 'gpio',
}

export class PeripheralDto {
  constructor(
    id: string,
    name: string,
    type: string,
    communicationType: string,
    gpio: number,
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.communicationType = communicationType;
    this.gpio = gpio;
  }

  @IsString()
  id: String;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  communicationType: string;

  @IsNumber()
  @IsOptional()
  gpio: number;
}

export class Peripheral {
  @IsString()
  name: string;

  @IsEnum(PeripheralType)
  type: PeripheralType;

  @IsEnum(PeripheralCommunicationType)
  communicationType: string;

  @IsNumber()
  @IsOptional()
  gpio: number;
}

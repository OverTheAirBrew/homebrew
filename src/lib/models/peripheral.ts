import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class PeripheralDto {
  constructor(id: string, name: string, type_id: string, config: any) {
    this.id = id;
    this.name = name;
    this.type_id = type_id;
    this.config = config;
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  type_id: string;

  @IsObject()
  @IsOptional()
  config: any;
}

export class Peripheral {
  @IsString()
  name: string;

  @IsString()
  type_id: string;

  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  config: any;
}

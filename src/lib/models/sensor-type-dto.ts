import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class SensorTypeDto {
  constructor(id: string, properties: PropertyDto[]) {
    this.id = id;
    this.properties = properties;
  }

  @IsString()
  id: string;

  @IsArray()
  properties: PropertyDto[];
}

export class PropertyDto {
  constructor(type: any, required: boolean, name: string, id: string) {
    this.type = type;
    this.isRequired = required;
    this.name = name;
    this.id = id;
  }

  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  placeholder: string;

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsArray()
  selectBoxValues: string[] | number[];

  @IsOptional()
  @IsString()
  selectBoxDefaultValue: string | number;
}

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
  constructor(type: any, required: boolean, name: string) {
    this.type = type;
    this.isRequired = required;
    this.name = name;
  }

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

import {
  Property,
  SelectBoxProperty,
  StringProperty,
} from '@overtheairbrew/homebrew-plugin/dist/properties';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class SensorTypeDto {
  constructor(id: string, properties: Property[]) {
    this.id = id;
    this.properties = properties.map((prop) => new PropertyDto(prop));
  }

  @IsString()
  id: string;

  @IsArray()
  properties: PropertyDto[];
}

export class PropertyDto {
  constructor(property: Property) {
    this.type = property.type;
    this.isRequired = property.required;
    this.name = property.name;

    if (property.type === 'select-box') {
      this.selectBoxValues = (property as SelectBoxProperty<any>).values;
    }

    if (property.type === 'string') {
      this.placeholder = (property as StringProperty).placeholder;
    }
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
  selectBoxValues: any[];
}

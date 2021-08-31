import { Property } from '@overtheairbrew/homebrew-plugin';
import { IsArray, IsString } from 'class-validator';
import { PropertyDto } from './sensor-type-dto';

export class PeripheralTypeDto {
  constructor(id: string, properties: Property[]) {
    this.id = id;
    this.properties = properties.map((prop) => new PropertyDto(prop));
  }

  @IsString()
  id: string;

  @IsArray()
  properties: PropertyDto[];
}

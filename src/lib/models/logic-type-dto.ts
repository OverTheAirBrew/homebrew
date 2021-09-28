import { IsArray, IsString } from 'class-validator';
import { PropertyDto } from './sensor-type-dto';

export class LogicTypeDto {
  constructor(id: string, properties: PropertyDto[]) {
    this.id = id;
    this.properties = properties;
  }

  @IsString()
  id: string;

  @IsArray()
  properties: PropertyDto[];
}

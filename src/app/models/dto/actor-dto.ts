import { IsArray, IsString } from 'class-validator';
import { PropertyDto } from './property-dto';

export class ActorTypeDto {
  constructor(type: string, properties: PropertyDto[]) {
    this.type = type;
    this.properties = properties;
  }

  @IsString() type: string;
  @IsArray() properties: PropertyDto[];
}

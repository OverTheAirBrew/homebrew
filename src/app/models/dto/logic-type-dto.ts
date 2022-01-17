import { PropertyDto } from './property-dto';

export class LogicTypeDto {
  constructor(public type: string, public properties: PropertyDto[]) {}
}

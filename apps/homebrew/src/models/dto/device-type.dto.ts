import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { PropertyDto } from './property.dto';

export class DeviceTypeDto {
  constructor(type: string, properties: PropertyDto[]) {
    this.type = type;

    this.properties = properties;
  }

  @IsString()
  @ApiProperty()
  type: string;

  @IsArray()
  @ApiProperty({
    type: PropertyDto,
    isArray: true,
  })
  properties: PropertyDto[];
}

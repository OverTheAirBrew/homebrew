import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class PropertyDto {
  constructor(id: string, type: string, required: boolean, name: string) {
    this.id = id;
    this.type = type;
    this.isRequired = required;
    this.name = name;
  }

  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  type: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  placeholder?: string;

  @IsBoolean()
  @ApiProperty()
  isRequired: boolean;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional()
  selectBoxValues?: string[] | number[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  selectBoxDefaultValue: string | number;
}

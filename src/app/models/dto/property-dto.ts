import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class PropertyDto {
  constructor(id: string, type: string, required: boolean, name: string) {
    this.id = id;
    this.type = type;
    this.isRequired = required;
    this.name = name;
  }

  @IsString() id: string;
  @IsString() type: string;
  @IsString() name: string;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsArray()
  selectBoxValues?: { key: string; value: string }[];

  @IsOptional()
  @IsString()
  selectBoxDefaultValue: string | number;
}

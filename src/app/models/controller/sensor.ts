import { IsObject, IsOptional, IsString } from 'class-validator';

export class Sensor {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  type_id: string;

  @IsObject()
  config: any;
}

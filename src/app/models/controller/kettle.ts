import { IsOptional, IsString } from 'class-validator';

export class Kettle {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  sensor_id?: string;

  @IsString()
  @IsOptional()
  heater_id?: string;
}

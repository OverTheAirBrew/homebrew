import { IsOptional, IsString } from 'class-validator';

export class Kettle {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sensor_id?: string;
}

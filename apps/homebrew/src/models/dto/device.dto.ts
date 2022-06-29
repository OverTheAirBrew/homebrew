import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class DeviceDto {
  constructor(id: string, name: string, type_id: string, config: any) {
    this.id = id;
    this.name = name;
    this.type_id = type_id;
    this.config = config;
  }

  id: string;

  @IsString()
  name: string;

  @IsString()
  // @Validate(ValidDeviceType)
  type_id: string;

  @IsObject()
  @IsNotEmpty()
  // @Validate(ValidDeviceConfig)
  config: any;
}

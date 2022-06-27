import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceTypesService } from '../lib/services/device-types/service';
import { ActorTypeDto } from '../models/dto/actor-type.dto';
import { DeviceTypeDto } from '../models/dto/device-type.dto';
import { SensorTypeDto } from '../models/dto/sensor-type.dto';

@ApiTags('device-types')
@Controller('device-types')
export class DeviceTypesController {
  constructor(private service: DeviceTypesService) {}

  @Get('/')
  @ApiResponse({
    type: DeviceTypeDto,
    isArray: true,
  })
  async get() {
    return await this.service.getDeviceTypes();
  }

  @ApiResponse({
    type: SensorTypeDto,
    isArray: true,
  })
  @Get('/:deviceType/sensors')
  async getSensors(@Param('deviceType') deviceType: string) {
    return await this.service.getSensors(deviceType);
  }

  @ApiResponse({
    type: ActorTypeDto,
    isArray: true,
  })
  @Get('/:deviceType/actors')
  async getActors(@Param('deviceType') deviceType: string) {
    return await this.service.getActors(deviceType);
  }
}

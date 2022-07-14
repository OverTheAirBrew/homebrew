import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActorTypesService } from '../../lib/services/actor-types/service';
import { DeviceService } from '../../lib/services/device/service';
import { SensorTypesService } from '../../lib/services/sensor-types/service';
import { ActorTypeDto } from '../../models/dto/actor-type.dto';
import { DeviceDto } from '../../models/dto/device.dto';
import { SensorTypeDto } from '../../models/dto/sensor-type.dto';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(
    private service: DeviceService,
    private sensorTypesService: SensorTypesService,
    private actorTypesService: ActorTypesService,
  ) {}

  @Get('/')
  @ApiResponse({
    type: DeviceDto,
    isArray: true,
  })
  async get() {
    return await this.service.getAllDevices();
  }

  @Get('/:device_id/sensor-types')
  @ApiResponse({
    type: SensorTypeDto,
    isArray: true,
  })
  async getSensorTypesForDevice(@Param('device_id') device_id: string) {
    return await this.sensorTypesService.getSensorTypesForDeviceId(device_id);
  }

  @Get('/:device_id/actor-types')
  @ApiResponse({
    type: ActorTypeDto,
    isArray: true,
  })
  async getActorTypesForDevice(@Param('device_id') device_id: string) {
    return await this.actorTypesService.getActorTypesForDeviceId(device_id);
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActorTypesService } from '../../lib/services/actor-types/service';
import { DeviceTypesService } from '../../lib/services/device-types/service';
import { SensorTypesService } from '../../lib/services/sensor-types/service';
import { ActorTypeDto } from '../../models/dto/actor-type.dto';
import { DeviceTypeDto } from '../../models/dto/device-type.dto';
import { SensorTypeDto } from '../../models/dto/sensor-type.dto';

@ApiTags('device-types')
@Controller('device-types')
export class DeviceTypesController {
  constructor(
    private deviceTypesService: DeviceTypesService,
    private sensorTypesService: SensorTypesService,
    private actorTypesService: ActorTypesService,
  ) {}

  @Get('/')
  @ApiResponse({
    type: DeviceTypeDto,
    isArray: true,
  })
  async get() {
    return await this.deviceTypesService.getDeviceTypes();
  }

  @ApiResponse({
    type: SensorTypeDto,
    isArray: true,
  })
  @Get('/:deviceType/sensor-types')
  async getSensors(@Param('deviceType') deviceType: string) {
    return await this.sensorTypesService.getSensorTypes(deviceType);
  }

  @ApiResponse({
    type: ActorTypeDto,
    isArray: true,
  })
  @Get('/:deviceType/actor-types')
  async getActors(@Param('deviceType') deviceType: string) {
    return await this.actorTypesService.getActorTypes(deviceType);
  }
}

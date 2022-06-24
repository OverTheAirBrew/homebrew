import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SensorTypesService } from '../lib/services/sensor-types/service';
import { SensorTypeDto } from '../models/dto/sensor-type.dto';

@ApiTags('sensor-types')
@Controller('sensor-types')
export class SensorTypesController {
  constructor(private service: SensorTypesService) {}

  @Get('/')
  @ApiOkResponse({
    type: SensorTypeDto,
    isArray: true,
  })
  async get() {
    return await this.service.getSensorTypes();
  }
}

import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SensorTypeDto } from '../../models/dto/sensor-type.dto';
import { SensorTypesService } from './service';

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

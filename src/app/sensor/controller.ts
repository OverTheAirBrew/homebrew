import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IdResponseDto } from '../../models/dto/id-response.dto';
import { SensorDto } from '../../models/dto/sensor.dto';
import { SensorService } from './service';

@ApiTags('sensors')
@Controller('sensors')
export class SensorController {
  constructor(private service: SensorService) {}

  @Post('/')
  @HttpCode(201)
  @ApiOkResponse({
    type: IdResponseDto,
  })
  async createSensor(@Body() sensor: SensorDto) {
    return await this.service.createSensor(
      sensor.name,
      sensor.type_id,
      sensor.config,
    );
  }

  @Get('/:sensorId')
  async getSensorById(@Param('sensorId') sensorId: string) {
    return await this.service.getSensorById(sensorId);
  }

  @Get('/')
  async getSensors() {
    return await this.service.getSensors();
  }
}

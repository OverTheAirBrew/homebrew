import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SensorService } from '../../lib/services/sensor/service';
import { IdResponseDto } from '../../models/dto/id-response.dto';
import { SensorDto } from '../../models/dto/sensor.dto';

@ApiTags('sensors')
@Controller('sensors')
export class SensorController {
  constructor(private service: SensorService) {}

  @Post('/')
  @HttpCode(201)
  @ApiCreatedResponse({
    type: IdResponseDto,
  })
  async createSensor(@Body() sensor: SensorDto) {
    const sensor_id = await this.service.createSensor(
      sensor.name,
      sensor.device_id,
      sensor.type_id,
      sensor.config,
    );

    return new IdResponseDto(sensor_id);
  }

  @Get('/:sensorId')
  @ApiOkResponse({
    type: SensorDto,
  })
  async getSensorById(@Param('sensorId') sensorId: string) {
    return await this.service.getSensorById(sensorId);
  }

  @Get('/')
  @ApiOkResponse({
    type: SensorDto,
    isArray: true,
  })
  async getSensors() {
    return await this.service.getSensors();
  }
}
